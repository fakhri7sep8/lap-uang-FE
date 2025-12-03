import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

// ✅ API Calls
const getCategories = async () => {
  return axiosClient.get("expense-category").then((res) => res.data);
};

const getCategoryById = async (id: string) => {
  return axiosClient.get(`expense-category/${id}`).then((res) => res.data);
};

const createCategory = async (payload: any) => {
  return axiosClient
    .post("expense-category/create", payload)
    .then((res) => res.data);
};

const updateCategory = async (id: string, payload: any) => {
  return axiosClient
    .patch(`expense-category/${id}`, payload)
    .then((res) => res.data);
};

const deleteCategory = async (id: string) => {
  return axiosClient.delete(`expense-category/${id}`).then((res) => res.data);
};

// ✅ Hooks
export const useCategoryExpense = () => {

  const useGetCategories = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ["expenseCategories"],
      queryFn: getCategories,
      refetchOnWindowFocus: false,
      select: (res) => res.data, 
    });

    // fungsi manual buat invalidasi data
    const refreshCategories = () => queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });

    return { data, isLoading, isError, refetch, refreshCategories };
  };

  const useGetCategoryById = (id: string) => {
    return useQuery({
      queryKey: ["expenseCategory", id],
      queryFn: () => getCategoryById(id),
      enabled: !!id, // hanya jalan kalau id ada
      select: (data) => data.data,
    });
  };

  const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createCategory,
      onSuccess: () => {
        Swal.fire("Berhasil", "Kategori berhasil dibuat", "success");
        queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
      },
      onError: (error: any) => {
        Swal.fire("Error", error.message || "Gagal membuat kategori", "error");
      },
    });
  };

  const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: any }) =>
        updateCategory(id, payload),
      onSuccess: () => {
        Swal.fire("Berhasil", "Kategori berhasil diperbarui", "success");
        queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
      },
      onError: (error: any) => {
        Swal.fire(
          "Error",
          error.message || "Gagal memperbarui kategori",
          "error"
        );
      },
    });
  };

  const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteCategory,
      onSuccess: () => {
        Swal.fire("Berhasil", "Kategori berhasil dihapus", "success");
        queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
      },
      onError: (error: any) => {
        Swal.fire(
          "Error",
          error.message || "Gagal menghapus kategori",
          "error"
        );
      },
    });
  };

  return {
    useGetCategories,
    useGetCategoryById,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
  };
};
