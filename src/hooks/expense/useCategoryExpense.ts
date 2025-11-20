import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export const useCategoryExpenseModule = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ✅ API Functions
  const getAll = async () => axiosClient.get("/expense-category");
  const create = async (data: any) => axiosClient.post("/expense-category/create", data);
  const createBulk = async (data: any[]) => axiosClient.post("/expense-category/create/bulk", data);
  const update = async (id: string, data: any) => axiosClient.patch(`/expense-category/${id}`, data);
  const remove = async (id: string) => axiosClient.delete(`/expense-category/${id}`);
  const getById = async (id: string) => axiosClient.get(`/expense-category/${id}`);

  // ✅ React Query Hooks
  const useGetCategoryExpense = () =>
    useQuery({
      queryKey: ["get-category-expense"],
      queryFn: getAll,
      select: (res) => res.data,
    });

  const useCreateCategoryExpense = () =>
    useMutation({
      mutationFn: create,
      onSuccess: () => {
        Swal.fire({ icon: "success", title: "Berhasil menambahkan kategori" });
        queryClient.invalidateQueries({ queryKey: ["get-category-expense"] });
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

  const useCreateBulkCategoryExpense = () =>
    useMutation({
      mutationFn: createBulk,
      onSuccess: () => Swal.fire({ icon: "success", title: "Berhasil menambahkan kategori secara bulk" }),
    });

  const useUpdateCategoryExpense = (id: string) =>
    useMutation({
      mutationFn: (data: any) => update(id, data),
      onSuccess: () => {
        Swal.fire({ icon: "success", title: "Kategori berhasil diperbarui" });
        router.push("/dashboard/expense-category");
      },
    });

  const useDeleteCategoryExpense = () =>
    useMutation({
      mutationFn: remove,
      onSuccess: () => {
        Swal.fire({ icon: "success", title: "Kategori dihapus" });
        queryClient.invalidateQueries({ queryKey: ["get-category-expense"] });
      },
    });

  return {
    useGetCategoryExpense,
    useCreateCategoryExpense,
    useCreateBulkCategoryExpense,
    useUpdateCategoryExpense,
    useDeleteCategoryExpense,
  };
};
