import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

// DTO type (samain dengan backend)
export interface CreatePaymentDto {
  studentId: string;
  typeId: string; // jenis pembayaran (misal SPP, Ujian, dsb.)
  nominal: number;
  month?: string;
  year?: number;
  status?: "LUNAS" | "BELUM_LUNAS";
}


export const usePaymentModule = () => {

  const getPayments = async () => {
    return await axiosClient.get("/payments/semua").then((res) => res.data);
  };

  const getRecapPayments = async () => {
    return await axiosClient.get("/payments/rekap/2025").then((res) => res.data);
  };

  const createPayment = async (payload: any) => {
    return await axiosClient
      .post("/payments/tambah", payload)
      .then((res) => res.data);
  };

  const updatePayment = async (id: string, payload: any) => {
    return await axiosClient
      .patch(`/payments/update/${id}`, payload)
      .then((res) => res.data);
  };

  const deletePayment = async (id: string) => {
    return await axiosClient
      .delete(`/payments/delete/${id}`)
      .then((res) => res.data);
  };

  const detailPayment = async (id: string) => {
    return await axiosClient
      .get(`/payments/detail/${id}`)
      .then((res) => res.data);
  };

  // ====================
  // QUERIES
  // ====================
  const useGetPayments = () => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["payments"],
      queryFn: getPayments,
      refetchOnWindowFocus: false,
      select: (res) => res.data, // asumsi BaseResponse { data: ... }
    });
    return { data, isLoading, isError };
  };

  const useGetRecapPayments = () => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["payments-recap"],
      queryFn: getRecapPayments,
      refetchOnWindowFocus: false,
      select: (res) => res.data,
    });
    return { data, isLoading, isError };
  };

  const useDetailPayment = (id: string) => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["payment-detail", id],
      queryFn: () => detailPayment(id),
      select: (res) => res.data,
    });
    return { data, isLoading, isError };
  };

  // ====================
  // MUTATIONS
  // ====================
  const useCreatePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: CreatePaymentDto) => createPayment(payload),
      onSuccess: () => {
        Swal.fire("Berhasil", "Pembayaran berhasil ditambahkan", "success");
        queryClient.invalidateQueries({ queryKey: ["payments"] });
      },
      onError: (error: any) => {
        Swal.fire("Error", "Gagal menambahkan: " + error.message, "error");
      },
    });
  };

  const useUpdatePayment = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload:any) => updatePayment(id, payload),
      onSuccess: () => {
        Swal.fire("Berhasil", "Pembayaran berhasil diupdate", "success");
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        queryClient.invalidateQueries({ queryKey: ["payment-detail", id] });
      },
      onError: (error: any) => {
        Swal.fire("Error", "Gagal mengupdate: " + error.message, "error");
      },
    });
  };

  const useDeletePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => deletePayment(id),
      onSuccess: () => {
        Swal.fire("Berhasil", "Pembayaran berhasil dihapus", "success");
        queryClient.invalidateQueries({ queryKey: ["payments"] });
      },
      onError: (error: any) => {
        Swal.fire("Error", "Gagal menghapus: " + error.message, "error");
      },
    });
  };

  return {
    useGetPayments,
    useGetRecapPayments,
    useDetailPayment,
    useCreatePayment,
    useUpdatePayment,
    useDeletePayment,
  };
};
