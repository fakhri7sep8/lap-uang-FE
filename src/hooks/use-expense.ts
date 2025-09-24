import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

// type interface untuk create / update expense
export interface CreateExpense {
  categoryId: string;
  date: string; // format ISO string "2025-09-10T00:00:00Z"
  amount: number;
  description: string;
}

// export interface UpdateExpense extends Partial<CreateExpense> {}

// export interface CreateCategory {
//   name: string;
// }

export const useExpenseModule = () => {
  // API calls
  const getExpenses = async () => {
    return await axiosClient.get("/expense/").then((res) => res.data);
  };

  const createManyExpenses = async (payload: CreateExpense[]) => {
    return await axiosClient
      .post("/expense/createMany", payload)
      .then((res) => res.data);
  };

  const createExpense = async (payload: CreateExpense) => {
    return await axiosClient.post("/expense/create", payload);
  };

  const updateExpense = async (id: string, payload: any) => {
    return await axiosClient
      .post(`/expense/updateExpense/${id}`, payload)
      .then((res) => res.data);
  };

  const useCreateExpense = () => {
    const queryClient = useQueryClient();
    const mutate = useMutation({
      mutationFn: (payload: CreateExpense) => createExpense(payload),
      onSuccess: () => {
        Swal.fire({
          title: "Berhasil",
          text: "Pengeluaran berhasil ditambahkan",
          icon: "success",
          confirmButtonText: "OK",
        });
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      },
      onError: (error: any) => {
        Swal.fire({
          title: "Error",
          text: "Gagal menambahkan pengeluaran: " + error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });
    return { mutate };
  };
  // React Query hooks
  const useGetExpenses = () => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["expenses"],
      queryFn: getExpenses,
      refetchOnWindowFocus: false,
      select: (data) => data.data, // sesuai BaseResponse -> { data: ... }
    });
    return { data, isLoading, isError };
  };

  const useCreateManyExpenses = () => {
    const queryClient = useQueryClient();
    const mutate = useMutation({
      mutationFn: (payload: CreateExpense[]) => createManyExpenses(payload),
      onSuccess: () => {
        Swal.fire({
          title: "Berhasil",
          text: "Pengeluaran berhasil ditambahkan",
          icon: "success",
          confirmButtonText: "OK",
        });
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      },
      onError: (error: any) => {
        Swal.fire({
          title: "Error",
          text: "Gagal menambahkan pengeluaran: " + error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });
    return { mutate };
  };

  const useUpdateExpense = (id: string) => {
    const queryClient = useQueryClient();
    const mutate = useMutation({
      mutationFn: (payload: any) => updateExpense(id, payload),
      onSuccess: () => {
        Swal.fire({
          title: "Berhasil",
          text: "Pengeluaran berhasil diupdate",
          icon: "success",
          confirmButtonText: "OK",
        });
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      },
      onError: (error: any) => {
        Swal.fire({
          title: "Error",
          text: "Gagal update pengeluaran: " + error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });
    return { mutate };
  };
  return {
    useGetExpenses,
    useCreateManyExpenses,
    useUpdateExpense,
    useCreateExpense
  };
};
