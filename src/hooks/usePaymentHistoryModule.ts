import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export const usePaymentHistoryModule = () => {
  // ======================
  // API CALLS
  // ======================
  const getAll = async () => {
    return axiosClient.get("/payment-history/all").then((res) => res.data);
  };

  const getDetail = async (id: string) => {
    return axiosClient.get(`/payment-history/detail/${id}`).then((res) => res.data);
  };

  const create = async (payload: any) => {
    return axiosClient.post("/payment-history/tambah", payload).then((res) => res.data);
  };

  const remove = async (id: string) => {
    return axiosClient.delete(`/payment-history/delete/${id}`).then((res) => res.data);
  };

  // ======================
  // QUERY: GET ALL
  // ======================
  const useGetAllHistory = () => {
    const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ["paymentHistoryAll"],
      queryFn: getAll,
      select: (res) => res.data,
      refetchOnWindowFocus: false,
    });

    return { data, isLoading, isError, refetch };
  };

  // ======================
  // QUERY: DETAIL
  // ======================
  const useDetailHistory = (id?: string) => {
    const { data, isLoading } = useQuery({
      queryKey: ["paymentHistoryDetail", id],
      queryFn: () => getDetail(id!),
      enabled: !!id,
      select: (res) => res.data,
    });

    return { data, isLoading };
  };

  // ======================
  // MUTATION: CREATE
  // ======================
  const useCreateHistory = () => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
      mutationFn: (payload: any) => create(payload),
      onSuccess: async () => {
        Swal.fire({
          title: "Berhasil",
          text: "Riwayat pembayaran berhasil ditambah!",
          icon: "success",
        });

        await queryClient.invalidateQueries({ queryKey: ["paymentHistoryAll"] });
      },
      onError: (err: any) => {
        Swal.fire({
          title: "Error",
          text: err.message ?? "Gagal menambah riwayat pembayaran",
          icon: "error",
        });
      },
    });

    return { mutate };
  };

  // ======================
  // MUTATION: DELETE
  // ======================
  const useDeleteHistory = () => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
      mutationFn: (id: string) => remove(id),
      onSuccess: async () => {
        Swal.fire({
          title: "Berhasil",
          text: "Riwayat pembayaran berhasil dihapus!",
          icon: "success",
        });

        await queryClient.invalidateQueries({ queryKey: ["paymentHistoryAll"] });
      },
      onError: () => {
        Swal.fire({
          title: "Error",
          text: "Gagal menghapus riwayat pembayaran",
          icon: "error",
        });
      },
    });

    return { mutate };
  };

  return {
    useGetAllHistory,
    useDetailHistory,
    useCreateHistory,
    useDeleteHistory,
  };
};
