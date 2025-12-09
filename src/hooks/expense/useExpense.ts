import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useExpenseModule = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const getAll = async (ct: string) => axiosClient.get(`/expense/${ct}`);
  const create = async (data: any) => axiosClient.post("/expense", data);
  const update = async (id: string, data: any) =>
    axiosClient.patch(`/expense/update/${id}`, data);
  const softDelete = async (id: string, isDelete: boolean) =>
    axiosClient.patch(`/expense/${id}/isdelete?isDelete=${isDelete}`);
  const remove = async (id: string) => axiosClient.delete(`/expense/${id}`);
  const detail = async (id: string) => axiosClient.get(`/expense/detail/${id}`);

  const useGetExpense = (ct: string) =>
    useQuery({
      queryKey: ["get-expense"],
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

  const useUpdateExpense = () => {
   return useMutation({
      mutationFn: (payload: any) => update(payload.idExpense, payload.data),
      onSuccess: (data) => {
        Swal.fire({ icon: "success", title: "Data pengeluaran diperbarui" });
        console.log(data);
        // queryClient.invalidateQueries({ queryKey: ["detail-expense", data.data] });
       
      },
    });
  }
    

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

  const useDetailExpense = (id: string) =>
    useQuery({
      queryKey: ["detail-expense", id],
      queryFn: () => detail(id),
      select: (res) => res.data,
    });

  return {
    useDetailExpense,
    useGetExpense,
    useCreateExpense,
    useUpdateExpense,
    useDeleteExpense,
    useSoftDeleteExpense,
  };
};
