import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Image as ImageIcon, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface MenuListProps {
  restaurantId: number;
}

export function MenuList({ restaurantId }: MenuListProps) {
  const { t } = useLanguage();
  
  const { data: menus, isLoading, refetch } = trpc.business.getMenus.useQuery({ restaurantId });

  const deleteMenuMutation = trpc.business.deleteMenu.useMutation({
    onSuccess: () => {
      toast.success(t("Menu deleted successfully", "Menú eliminado exitosamente"));
      refetch();
    },
    onError: () => {
      toast.error(t("Failed to delete menu", "Error al eliminar el menú"));
    },
  });

  const handleDelete = (menuId: number) => {
    if (confirm(t("Are you sure you want to delete this menu?", "¿Estás seguro de que quieres eliminar este menú?"))) {
      deleteMenuMutation.mutate({ menuId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!menus || menus.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          {t("No menus uploaded yet", "No hay menús subidos aún")}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {t("Uploaded Menus", "Menús Subidos")}
      </h3>
      <div className="grid gap-4">
        {menus.map((menu) => (
          <Card key={menu.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {menu.fileType === "pdf" ? (
                  <div className="w-16 h-16 bg-red-100 rounded flex items-center justify-center">
                    <FileText className="w-8 h-8 text-red-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{menu.title}</p>
                <p className="text-sm text-muted-foreground">
                  {t("Uploaded on", "Subido el")} {new Date(menu.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={menu.fileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t("View", "Ver")}
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(menu.id)}
                  disabled={deleteMenuMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
