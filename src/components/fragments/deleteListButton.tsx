import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import React from "react";

interface DeleteListButtonProps {
  selectedIds: string[];
  onDelete: (ids: string[]) => Promise<void>;
  disabled?: boolean;
}

const DeleteListButton: React.FC<DeleteListButtonProps> = ({
  selectedIds,
  onDelete,
  disabled,
}) => {
  const handleClick = async () => {
    const result = await Swal.fire({
      title: "Hapus Data Terpilih?",
      text: `Anda akan menghapus ${selectedIds.length} data siswa!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c", // merah tua
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      background: "#fee2e2", // latar belakang merah muda
      color: "#7f1d1d", // teks merah gelap
      customClass: {
        popup: "border-2 border-red-600 shadow-lg",
        confirmButton: "text-white bg-red-600 hover:bg-red-700",
        cancelButton: "text-white bg-blue-500 hover:bg-blue-600",
      },
    });

    if (result.isConfirmed) {
      await onDelete(selectedIds);
      await Swal.fire({
        title: "Terhapus!",
        text: "Data berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#16a34a", // hijau untuk sukses
      });
    }
  };

  return (
    <Button
      variant="destructive"
      disabled={disabled || selectedIds.length === 0}
      onClick={handleClick}
      className="flex items-center gap-2 bg-white hover:bg-red-700"
    >
      <Trash2 size={16} />
      Delete List
    </Button>
  );
};

export default DeleteListButton;
