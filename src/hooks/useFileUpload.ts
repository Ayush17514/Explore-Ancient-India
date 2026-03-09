import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MAX_IMAGE_DIMENSION = 1920;
const IMAGE_QUALITY = 0.8;
const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB
const WARN_PDF_SIZE = 10 * 1024 * 1024; // 10MB

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export type UploadResult = {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
};

/**
 * Compress an image file using Canvas API.
 * Returns a compressed Blob (JPEG) resized to fit within MAX_IMAGE_DIMENSION.
 */
export function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      // Scale down if exceeds max dimension
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/jpeg",
        IMAGE_QUALITY
      );
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

/**
 * Validate file type and size.
 */
export function validateFile(file: File): { valid: boolean; error?: string; warning?: string } {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { valid: false, error: `Unsupported file type: ${file.type}. Accepted: PDF, JPEG, PNG, TIFF, DOCX` };
  }
  if (file.type === "application/pdf" && file.size > MAX_PDF_SIZE) {
    return { valid: false, error: `PDF exceeds maximum size of ${MAX_PDF_SIZE / 1024 / 1024}MB` };
  }
  if (file.type === "application/pdf" && file.size > WARN_PDF_SIZE) {
    return { valid: true, warning: `Large PDF (${(file.size / 1024 / 1024).toFixed(1)}MB). Consider compressing for faster uploads.` };
  }
  return { valid: true };
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = useCallback(
    async (
      file: File,
      bucket: string,
      pathPrefix: string,
      meta?: { title?: string; resourceType?: string; sourceTable?: string; sourceId?: string; userId?: string }
    ): Promise<UploadResult | null> => {
      // Validate
      const validation = validateFile(file);
      if (!validation.valid) {
        toast({ title: "Invalid file", description: validation.error, variant: "destructive" });
        return null;
      }
      if (validation.warning) {
        toast({ title: "Warning", description: validation.warning });
      }

      setUploading(true);
      setProgress(10);

      try {
        // Compress images before upload
        let uploadBlob: Blob | File = file;
        let mimeType = file.type;
        let fileName = file.name;

        if (file.type.startsWith("image/") && file.type !== "image/tiff") {
          setProgress(20);
          uploadBlob = await compressImage(file);
          mimeType = "image/jpeg";
          fileName = file.name.replace(/\.[^.]+$/, ".jpg");
          setProgress(40);
        }

        // Generate unique path
        const timestamp = Date.now();
        const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `${pathPrefix}/${timestamp}_${safeName}`;

        setProgress(50);

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(storagePath, uploadBlob, {
            contentType: mimeType,
            upsert: false,
          });

        if (uploadError) {
          toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
          return null;
        }

        setProgress(80);

        // Get public URL
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
        const publicUrl = urlData.publicUrl;

        // Track in resource_tracker
        if (meta?.userId) {
          await supabase
            .from("resource_tracker" as any)
            .insert({
              title: meta.title || fileName,
              resource_type: meta.resourceType || "file",
              mime_type: mimeType,
              file_size_bytes: uploadBlob.size,
              file_url: publicUrl,
              source_table: meta.sourceTable || null,
              source_id: meta.sourceId || null,
              uploaded_by: meta.userId,
            } as any);
        }

        setProgress(100);

        toast({ title: "File uploaded successfully" });

        return {
          url: publicUrl,
          fileName,
          fileSize: uploadBlob.size,
          mimeType,
        };
      } catch (err: any) {
        toast({ title: "Upload error", description: err?.message || "Unknown error", variant: "destructive" });
        return null;
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [toast]
  );

  return { uploadFile, uploading, progress };
}
