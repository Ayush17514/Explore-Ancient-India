import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useCallback } from "react";

export type SupportedLanguage = {
  code: string;
  name: string;
  native_name: string;
  is_active: boolean;
};

export function useSupportedLanguages() {
  return useQuery({
    queryKey: ["supported-languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("supported_languages")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data as SupportedLanguage[];
    },
    staleTime: 1000 * 60 * 30, // 30 min
  });
}

export function useTranslations(entityType: string, entityIds: string[], language: string) {
  return useQuery({
    queryKey: ["translations", entityType, language, entityIds],
    queryFn: async () => {
      if (!entityIds.length || language === "en") return {};
      const { data, error } = await supabase
        .from("translations")
        .select("entity_id, field_name, translated_text")
        .eq("entity_type", entityType)
        .eq("language_code", language)
        .in("entity_id", entityIds);
      if (error) throw error;

      const map: Record<string, Record<string, string>> = {};
      for (const t of data || []) {
        if (!map[t.entity_id]) map[t.entity_id] = {};
        map[t.entity_id][t.field_name] = t.translated_text;
      }
      return map;
    },
    enabled: entityIds.length > 0 && language !== "en",
    staleTime: 1000 * 60 * 10,
  });
}

export function useLanguageState() {
  const [language, setLanguage] = useState("en");
  const getField = useCallback(
    (translations: Record<string, Record<string, string>> | undefined, entityId: string, field: string, fallback: string) => {
      if (language === "en" || !translations) return fallback;
      return translations[entityId]?.[field] || fallback;
    },
    [language]
  );
  return { language, setLanguage, getField };
}
