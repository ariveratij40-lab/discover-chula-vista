import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, FileText, Image as ImageIcon, Loader2, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface MenuUploaderProps {
  restaurantId: number;
  onUploadComplete?: () => void;
}

export function MenuUploader({ restaurantId, onUploadComplete }: MenuUploaderProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch existing menus
  const { data: menus, refetch: refetchMenus } = trpc.business.getMenus.useQuery({ restaurantId });

  const validateFile = (file: File): boolean => {
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast.error(t("Invalid file type. Please upload PDF, JPG, or PNG.", "Tipo de archivo inválido. Por favor sube PDF, JPG o PNG."));
      return false;
    }

    if (file.size > maxSize) {
      toast.error(t("File too large. Maximum size is 10MB.", "Archivo demasiado grande. El tamaño máximo es 10MB."));
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const uploadMenuMutation = trpc.business.uploadMenu.useMutation({
    onSuccess: () => {
      toast.success(t("Menu uploaded successfully!", "¡Menú subido exitosamente!"));
      setSelectedFile(null);
      setPreviewUrl(null);
      refetchMenus();
      onUploadComplete?.();
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error(t("Failed to upload menu. Please try again.", "Error al subir el menú. Por favor intenta de nuevo."));
    },
  });

  const deleteMenuMutation = trpc.business.deleteMenu.useMutation({
    onSuccess: () => {
      toast.success(t("Menu deleted successfully!", "¡Menú eliminado exitosamente!"));
      refetchMenus();
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error(t("Failed to delete menu. Please try again.", "Error al eliminar el menú. Por favor intenta de nuevo."));
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        // Upload to S3 via tRPC
        await uploadMenuMutation.mutateAsync({
          restaurantId,
          title: selectedFile.name,
          fileUrl: base64,
          fileType: selectedFile.type === "application/pdf" ? "pdf" : "image",
        });
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      // Error handled by mutation
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (menuId: number) => {
    if (confirm(t("Are you sure you want to delete this menu?", "¿Estás seguro de que quieres eliminar este menú?"))) {
      deleteMenuMutation.mutate({ menuId });
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6">
      {/* Existing Menus */}
      {menus && menus.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("Uploaded Menus", "Menús Subidos")}
          </h3>
          <div className="grid gap-4">
            {menus.map((menu) => (
              <Card key={menu.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {menu.fileType === "image" ? (
                      <ImageIcon className="w-10 h-10 text-muted-foreground" />
                    ) : (
                      <FileText className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{menu.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("Uploaded", "Subido")}: {new Date(menu.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(menu.fileUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t("View", "Ver")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(menu.id)}
                      disabled={deleteMenuMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t("Delete", "Eliminar")}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {t("Upload New Menu", "Subir Nuevo Menú")}
        </h3>
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {t("Upload Menu", "Subir Menú")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                "Drag and drop your menu file here, or click to browse",
                "Arrastra y suelta tu archivo de menú aquí, o haz clic para buscar"
              )}
            </p>
            <input
              type="file"
              id="menu-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInput}
            />
            <Button asChild variant="outline">
              <label htmlFor="menu-upload" className="cursor-pointer">
                {t("Browse Files", "Buscar Archivos")}
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {t("Supported formats: PDF, JPG, PNG (max 10MB)", "Formatos soportados: PDF, JPG, PNG (máx 10MB)")}
            </p>
          </div>
        </Card>
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <Card className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded" />
              ) : (
                <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("Uploading...", "Subiendo...")}
                    </>
                  ) : (
                    t("Upload Menu", "Subir Menú")
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
