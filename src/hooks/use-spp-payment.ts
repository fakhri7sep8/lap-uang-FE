import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

// type interface untuk create / update payment
export interface CreateSppPayment {
  studentId: string;
  month: string;
  year: number;
  nominal: number;
  status?: "LUNAS" | "BELUM_LUNAS";
}

// export interface UpdateSppPayment extends Partial<CreateSppPayment> {}

export const useSppPaymentModule = () => {
  // API calls
  const getPayments = async () => {
    return await axiosClient.get("/spp-payment").then((res) => res.data);
  };

  const createPayment = async (payload: CreateSppPayment) => {
    return await axiosClient
      .post("/spp-payment", payload)
      .then((res) => res.data);
  };

  const updatePayment = async (id: string, payload: any) => {
    return await axiosClient
      .put(`/spp-payment/${id}`, payload)
      .then((res) => res.data);
  };

  const deletePayment = async (id: string) => {
    return await axiosClient
      .delete(`/spp-payment/${id}`)
      .then((res) => res.data);
  };

  const detailPayment = async (id: string) => {
    return await axiosClient.get(`/spp-payment/${id}`).then((res) => res.data);
  };

  // React Query hooks
  const useGetPayments = () => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["sppPayments"],
      queryFn: getPayments,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      select: (data) => data.data, // sesuai response BaseResponse -> { data: ... }
    });
    return { data, isLoading, isError };
  };

  const useCreatePayment = () => {
    const queryClient = useQueryClient();
    const mutate = useMutation({
      mutationFn: (payload: CreateSppPayment) => createPayment(payload),
      onSuccess: () => {
        Swal.fire({
          title: "Berhasil",
          text: "Pembayaran SPP berhasil dibuat",
          icon: "success",
          confirmButtonText: "OK",
        });
        // ⬇️ otomatis update cache
        queryClient.invalidateQueries({ queryKey: ["sppPayments"] });
      },
      onError: (error: any) => {
        Swal.fire({
          title: "Error",
          text: "Pembayaran gagal dibuat: " + error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });

    return { mutate };
  };

  const useUpdatePayment = (id: string) => {
    const queryClient = useQueryClient();
    const mutate = useMutation({
      mutationFn: (payload: any) => updatePayment(id, payload),
      onSuccess: () => {
        Swal.fire({
          title: "Berhasil",
          text: "Pembayaran SPP berhasil diupdate",
          icon: "success",
          confirmButtonText: "OK",
        });
        queryClient.invalidateQueries({ queryKey: ["sppPayments"] });
        queryClient.invalidateQueries({ queryKey: ["sppPaymentDetail", id] });
      },
      onError: (error: any) => {
        Swal.fire({
          title: "Error",
          text: "Pembayaran gagal diupdate: " + error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });

    return { mutate };
  };

  const useDeletePayment = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (id: string) => deletePayment(id),
    onSuccess: () => {
      Swal.fire({
        title: "Berhasil",
        text: "Pembayaran SPP berhasil dihapus",
        icon: "success",
        confirmButtonText: "OK",
      });
      queryClient.invalidateQueries({ queryKey: ["sppPayments"] });
    },
    onError: (error: any) => {
      Swal.fire({
        title: "Error",
        text: "Pembayaran gagal dihapus: " + error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  return { mutate }; // sekarang mutate benar2 function
};


  const useDetailPayment = (id: string) => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["sppPaymentDetail", id],
      queryFn: () => detailPayment(id),
      select: (data) => data.data,
    });

    return { data, isLoading, isError };
  };

  return {
    useGetPayments,
    useCreatePayment,
    useUpdatePayment,
    useDeletePayment,
    useDetailPayment,
  };
};
