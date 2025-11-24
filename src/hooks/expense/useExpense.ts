import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useExpenseModule = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const getAll = async (ct:string) => axiosClient.get(`/expense/${ct}`);
  const create = async (data: any) => axiosClient.post("/expense", data);
  // yang benar
const getAllExpense = async () => axiosClient.get(`/expense`);

  const update = async (id: string, data: any) =>
    axiosClient.patch(`/updateExpense/${id}`, data);
  const softDelete = async (id: string, isDelete: boolean) =>
    axiosClient.patch(`/expense/${id}/isdelete?isDelete=${isDelete}`);
  const remove = async (id: string) => axiosClient.delete(`/expense/${id}`);
  const detail = async (id: string) => axiosClient.get(`/expense/${id}`);

  const useGetExpense = (ct:string) =>
    useQuery({
      queryKey: ["get-expense", ct],
      queryFn: () => getAll(ct),
      select: (res) => res.data,
    });

  const useCreateExpense = () =>
    useMutation({
      mutationFn: create,
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Pengeluaran berhasil ditambahkan",
        });
        queryClient.invalidateQueries({ queryKey: ["get-expense"] });
      },
      onError: (error) => {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: axios.isAxiosError(error)
            ? error.response?.data?.message
            : "Terjadi kesalahan",
        });
      },
    });
const useGetAllExpense = () =>
  useQuery({
    queryKey: ["get-all-expense"],
    queryFn: async () => {
      const kategori = [
        "Operasional",
        "Pemeliharaan",
        "Upah Karyawan",
        "Makan"
      ];

      const requests = kategori.map((ct) => getAll(ct));
      const results = await Promise.all(requests);

      // gabung semua data jadi 1 list
      return results.flatMap((r) => r.data.data);
    },
  });



const useDetailExpense = (id: string) =>
  useQuery({
    queryKey: ["detail-expense", id],
    queryFn: () => detail(id),
    enabled: !!id, // hanya jalan kalau id ada
    select: (res) => res.data.data, // BE balikin { data: {...} }
  });



  const useUpdateExpense = (id: string) =>
    useMutation({
      mutationFn: (data: any) => update(id, data),
      onSuccess: () => {
        Swal.fire({ icon: "success", title: "Data pengeluaran diperbarui" });
        router.push("/dashboard/expense");
      },
    });

  const useDeleteExpense = () =>
    useMutation({
      mutationFn: (id: string) => remove(id),
      onSuccess: () => {
        Swal.fire({ icon: "success", title: "Data pengeluaran dihapus" });
        queryClient.invalidateQueries({ queryKey: ["get-expense"] });
      },
    });

  const useSoftDeleteExpense = () =>
    useMutation({
      mutationFn: ({ id, isDelete }: { id: string; isDelete: boolean }) =>
        softDelete(id, isDelete),
      onSuccess: () => {
        Swal.fire({ icon: "success", title: "Status penghapusan diperbarui" });
        queryClient.invalidateQueries({ queryKey: ["get-expense"] });
      },
    });

  return {
    useGetExpense,
    useCreateExpense,
    useUpdateExpense,
    useDeleteExpense,
    useSoftDeleteExpense,
    useDetailExpense,
    useGetAllExpense
  };
};
