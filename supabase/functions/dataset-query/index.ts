import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Allowed tables and their queryable fields
const ENTITY_CONFIG: Record<string, { table: string; fields: string[]; defaultFields: string[] }> = {
  manuscripts: {
    table: "manuscripts",
    fields: ["id", "title", "description", "domain", "estimated_period", "repository_source", "file_url", "status", "created_at", "updated_at", "author_id", "language_id", "dynasty_id"],
    defaultFields: ["id", "title", "description", "domain", "estimated_period", "status", "created_at"],
  },
  architecture_sites: {
    table: "architecture_sites",
    fields: ["id", "name", "location", "region", "era", "description", "architectural_style", "image_url", "status", "created_at", "updated_at", "dynasty_id"],
    defaultFields: ["id", "name", "location", "region", "era", "description", "status", "created_at"],
  },
  philosophical_schools: {
    table: "philosophical_schools",
    fields: ["id", "name", "tradition", "founder", "period", "core_texts", "description", "status", "created_at", "updated_at"],
    defaultFields: ["id", "name", "tradition", "founder", "period", "description", "status", "created_at"],
  },
  tribal_records: {
    table: "tribal_records",
    fields: ["id", "community_name", "region", "knowledge_type", "documenter_name", "description", "media_url", "status", "created_at", "updated_at"],
    defaultFields: ["id", "community_name", "region", "knowledge_type", "description", "status", "created_at"],
  },
  citations: {
    table: "citations",
    fields: ["id", "title", "authors", "source", "year", "doi", "url", "citation_type", "domain", "status", "created_at"],
    defaultFields: ["id", "title", "authors", "source", "year", "domain", "status", "created_at"],
  },
  research_submissions: {
    table: "research_submissions",
    fields: ["id", "paper_title", "authors", "affiliation", "domain", "abstract", "file_url", "status", "created_at", "updated_at"],
    defaultFields: ["id", "paper_title", "authors", "domain", "abstract", "status", "created_at"],
  },
  translations: {
    table: "translations",
    fields: ["id", "entity_type", "entity_id", "field_name", "language_code", "translated_text", "is_machine_translated", "created_at"],
    defaultFields: ["id", "entity_type", "entity_id", "field_name", "language_code", "translated_text"],
  },
  supported_languages: {
    table: "supported_languages",
    fields: ["code", "name", "native_name", "is_active"],
    defaultFields: ["code", "name", "native_name", "is_active"],
  },
};

type FilterOp = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "ilike" | "in" | "is";

interface QueryFilter {
  field: string;
  op: FilterOp;
  value: unknown;
}

interface QueryRequest {
  entity: string;
  fields?: string[];
  filters?: QueryFilter[];
  order_by?: { field: string; direction?: "asc" | "desc" };
  limit?: number;
  offset?: number;
  language?: string; // Include translations in this language
  include_translations?: boolean;
}

async function validateApiKey(supabaseAdmin: ReturnType<typeof createClient>, apiKey: string): Promise<{ valid: boolean; userId?: string }> {
  // Hash the key
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const keyHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  const { data: keyData, error } = await supabaseAdmin
    .from("api_keys")
    .select("id, user_id, is_active, expires_at")
    .eq("key_hash", keyHash)
    .single();

  if (error || !keyData || !keyData.is_active) return { valid: false };
  if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) return { valid: false };

  // Update last_used_at
  await supabaseAdmin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id);

  return { valid: true, userId: keyData.user_id };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Validate API key
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing x-api-key header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { valid } = await validateApiKey(supabaseAdmin, apiKey);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid or expired API key" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse query
    let queryReq: QueryRequest;
    if (req.method === "POST") {
      queryReq = await req.json();
    } else if (req.method === "GET") {
      const url = new URL(req.url);
      queryReq = {
        entity: url.searchParams.get("entity") || "",
        fields: url.searchParams.get("fields")?.split(","),
        limit: url.searchParams.has("limit") ? parseInt(url.searchParams.get("limit")!) : undefined,
        offset: url.searchParams.has("offset") ? parseInt(url.searchParams.get("offset")!) : undefined,
        language: url.searchParams.get("language") || undefined,
        include_translations: url.searchParams.get("include_translations") === "true",
      };
    } else {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate entity
    const config = ENTITY_CONFIG[queryReq.entity];
    if (!config) {
      return new Response(JSON.stringify({
        error: `Unknown entity: ${queryReq.entity}`,
        available_entities: Object.keys(ENTITY_CONFIG),
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate and select fields
    const requestedFields = queryReq.fields?.length ? queryReq.fields : config.defaultFields;
    const invalidFields = requestedFields.filter(f => !config.fields.includes(f));
    if (invalidFields.length > 0) {
      return new Response(JSON.stringify({
        error: `Invalid fields: ${invalidFields.join(", ")}`,
        available_fields: config.fields,
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build query
    let query = supabaseAdmin.from(config.table).select(requestedFields.join(","), { count: "exact" });

    // Apply filters (only approved content via API)
    if (config.fields.includes("status")) {
      query = query.eq("status", "approved");
    }

    if (queryReq.filters) {
      for (const filter of queryReq.filters) {
        if (!config.fields.includes(filter.field)) continue;
        switch (filter.op) {
          case "eq": query = query.eq(filter.field, filter.value); break;
          case "neq": query = query.neq(filter.field, filter.value); break;
          case "gt": query = query.gt(filter.field, filter.value); break;
          case "gte": query = query.gte(filter.field, filter.value); break;
          case "lt": query = query.lt(filter.field, filter.value); break;
          case "lte": query = query.lte(filter.field, filter.value); break;
          case "like": query = query.like(filter.field, filter.value as string); break;
          case "ilike": query = query.ilike(filter.field, filter.value as string); break;
          case "in": query = query.in(filter.field, filter.value as string[]); break;
          case "is": query = query.is(filter.field, filter.value as null); break;
        }
      }
    }

    // Ordering
    if (queryReq.order_by && config.fields.includes(queryReq.order_by.field)) {
      query = query.order(queryReq.order_by.field, { ascending: queryReq.order_by.direction !== "desc" });
    }

    // Pagination
    const limit = Math.min(queryReq.limit || 50, 200);
    const offset = queryReq.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    // Optionally join translations
    let translatedData = data;
    if (queryReq.include_translations && queryReq.language && data && data.length > 0) {
      const entityIds = data.map((r: Record<string, unknown>) => (r.id || r.code) as string);
      const { data: translations } = await supabaseAdmin
        .from("translations")
        .select("entity_id, field_name, translated_text")
        .eq("entity_type", queryReq.entity)
        .eq("language_code", queryReq.language)
        .in("entity_id", entityIds);

      if (translations && translations.length > 0) {
        const translationMap = new Map<string, Record<string, string>>();
        for (const t of translations) {
          if (!translationMap.has(t.entity_id)) translationMap.set(t.entity_id, {});
          translationMap.get(t.entity_id)![t.field_name] = t.translated_text;
        }

        translatedData = data.map((record: Record<string, unknown>) => {
          const id = (record.id || record.code) as string;
          const trans = translationMap.get(id);
          if (!trans) return record;
          return { ...record, _translations: trans };
        });
      }
    }

    return new Response(JSON.stringify({
      entity: queryReq.entity,
      data: translatedData,
      meta: {
        total: count,
        limit,
        offset,
        language: queryReq.language || null,
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
