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
  // status?: "LUNAS" | "BELUM_LUNAS";
}

export const usePaymentModule = () => {
  const getPayments = async () => {
    return await axiosClient.get("/payments/semua").then((res) => res.data);
  };

  const getPaymentsByCNS = async (ids: string, idc: string) => {
    return await axiosClient
      .get(`/payments/filter/${ids}/${idc}`)
      .then((res) => res.data);
  };

  const getByCategories = async (name: string) => {
    const res = await axiosClient.get(`/payments/category/${name}`);
    return res.data;
  };

  const getCicilanPayments = async (typeId: string) => {
    return await axiosClient
      .get(`/payments/cicilan/${typeId}`)
      .then((res) => res.data);
  };

  const getRecapPayments = async () => {
    return await axiosClient
      .get("/payments/rekap/2025")
      .then((res) => res.data);
  };

  const createPayment = async (payload: any) => {
    return await axiosClient
      .post("/payments/tambah", payload)
      .then((res) => res.data);
  };

  const updatePayment = async (id: string, payload: any, typeId: string) => {
    return await axiosClient
      .patch(`/payments/update/${id}/2025/${typeId}`, payload)
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

  const useGetPayments = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ["payments"],
      queryFn: getPayments,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      select: (res) => res.data,
    });

    const refreshPayments = () =>
      queryClient.invalidateQueries({ queryKey: ["payments"] });

    return { data, isLoading, isError, refetch, refreshPayments };
  };

  const useGetRecapPayments = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ["payments-recap"],
      queryFn: getRecapPayments,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      select: (res) => res.data,
    });

    const refreshRecapPayments = () =>
      queryClient.invalidateQueries({ queryKey: ["payments-recap"] });

    return { data, isLoading, isError, refetch, refreshRecapPayments };
  };

  const useDetailPayment = (id: string) => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["payment-detail", id],
      queryFn: () => detailPayment(id),
      select: (res) => res.data,
    });
    return { data, isLoading, isError };
  };

  const useGetCicilanPayments = () => {
    const mutation = useMutation({
      mutationFn: (typeId: string) =>
        getCicilanPayments(typeId).then((res) => res.data),
    });

    return mutation;
  };

  const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePaymentDto) => createPayment(payload),
    onSuccess: async (_data, payload) => {
      Swal.fire("Berhasil", "Pembayaran berhasil ditambahkan", "success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["payments"] }),
        queryClient.invalidateQueries({
          queryKey: ["payments-by-cns", payload.studentId, payload.typeId],
        }),
      ]);
    },
    onError: (error: any) => {
      Swal.fire("Error", "Gagal menambahkan: " + error.message, "error");
    },
  });
};


  const useGetPaymentsByCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (name: string) => getByCategories(name),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["payments"] });
      },
      onError: (error: any) => {
        Swal.fire("Error", "Gagal mengambil data: " + error.message, "error");
      },
    });
  };

 const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      updatePayment(payload.studentId, payload, payload.typeId),
    onSuccess: async (_data, payload) => {
      Swal.fire("Berhasil", "Pembayaran berhasil diupdate", "success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["payments"] }),
        queryClient.invalidateQueries({
          queryKey: ["payments-by-cns", payload.studentId, payload.typeId],
        }),
        queryClient.invalidateQueries({ queryKey: ["payment-detail"] }),
      ]);
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
  const useGetPaymentsByCNS = (ids: string, idc: string) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ["payments-by-cns", ids, idc],
      queryFn: () => getPaymentsByCNS(ids, idc),
      enabled: !!ids && !!idc,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      select: (res) => res.data,
    });

    const refreshPaymentsByCNS = () =>
      queryClient.invalidateQueries({
        queryKey: ["payments-by-cns", ids, idc],
      });

    return { data, isLoading, isError, refetch, refreshPaymentsByCNS };
  };

  return {
    useGetPayments,
    useGetRecapPayments,
    useDetailPayment,
    useCreatePayment,
    useUpdatePayment,
    useDeletePayment,
    useGetPaymentsByCategory,
    useGetPaymentsByCNS,
    useGetCicilanPayments,
  };
};
