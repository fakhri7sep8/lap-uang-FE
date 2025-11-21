/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  GetBudgetExpense,
  CreateBudgetExpense,
  UpdateBudgetExpense,
} from "@/interface/use-pengeluaran";

export const useBudgetExpenseModule = () => {
  const getBudgetExpenseData = async (): Promise<GetBudgetExpense[]> => {
    const res = await axiosClient.get("/budget-expense");

    // ✅ Normalisasi: pastikan hasil selalu array
    if (Array.isArray(res.data)) {
      return res.data;
    }
    if (Array.isArray(res.data.data)) {
      return res.data.data;
    }
    if (Array.isArray(res.data.result)) {
      return res.data.result;
    }

    return []; // fallback kalau format unexpected
  };

  const useGetBudgetExpense = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery<GetBudgetExpense[]>({
    queryKey: ["budget-expense"],
    queryFn: getBudgetExpenseData,
    refetchOnWindowFocus: false,
  });

  const refreshBudgetExpense = () =>
    queryClient.invalidateQueries({ queryKey: ["budget-expense"] });

  return { data, isLoading, isError, refetch, refreshBudgetExpense };
};


  // 🔹 CREATE
  const createBudgetExpense = async (data: CreateBudgetExpense) => {
    return await axiosClient.post("/budget-expense", data);
  };

  const useCreateBudgetExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateBudgetExpense) => createBudgetExpense(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["budget-expense"] });
        Swal.fire("Berhasil!", "Data pengeluaran berhasil ditambahkan", "success");
      },
      onError: () => {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan pengeluaran", "error");
      },
    });
  };

  // 🔹 UPDATE
  const updateBudgetExpense = async (id: string, data: UpdateBudgetExpense) => {
    return await axiosClient.put(`/budget-expense/${id}`, data);
  };

  const useUpdateBudgetExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, ...data }: UpdateBudgetExpense & { id: string }) =>
        updateBudgetExpense(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["budget-expense"] });
        Swal.fire("Berhasil!", "Data pengeluaran berhasil diperbarui", "success");
      },
      onError: () => {
        Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui pengeluaran", "error");
      },
    });
  };

  // 🔹 DELETE
  const deleteBudgetExpense = async (id: string) => {
    return await axiosClient.delete(`/budget-expense/${id}`);
  };

  const useDeleteBudgetExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => deleteBudgetExpense(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["budget-expense"] });
        Swal.fire("Berhasil!", "Data pengeluaran berhasil dihapus", "success");
      },
      onError: () => {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus pengeluaran", "error");
      },
    });
  };

  return {
    useGetBudgetExpense,
    useCreateBudgetExpense,
    useUpdateBudgetExpense,
    useDeleteBudgetExpense,
  };
};
