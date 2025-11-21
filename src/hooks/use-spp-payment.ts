import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

// type interface untuk create / update payment
export interface CreateSppPayment {
  studentId: string;
  month: string;
  year: string;
  nominal: number;
  status?: "LUNAS" | "BELUM_LUNAS";
}

// export interface UpdateSppPayment extends Partial<CreateSppPayment> {}

export const useSppPaymentModule = () => {
  // API calls
  const getPayments = async () => {
    return await axiosClient.get("/spp-payment/all").then((res) => res.data);
  };

  const getRecapSPPPayment = async () => {
    return await axiosClient
      .get(`/spp-payment/rekap/${new Date().getFullYear()}/${new Date().getFullYear() + 1}`)
      .then((res) => res.data);
  };

  const getByStudentID = async (studentID: string, year: string) => {
    return await axiosClient
      .get(`/spp-payment/student/${studentID}/${year}`)
      .then((res) => res.data);
  };

  const createPayment = async (payload: CreateSppPayment) => {
    return await axiosClient
      .post("/spp-payment/tambah", payload)
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

 const useGetByStudentID = (studentID: string, year: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["sppPayments", studentID, year],
    queryFn: () => getByStudentID(studentID, year),
    enabled: !!studentID && !!year, // hanya fetch kalau dua-duanya ada
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (res) => res.data,
  });

  const refreshByStudentID = () =>
    queryClient.invalidateQueries({ queryKey: ["sppPayments", studentID, year] });

  return { data, isLoading, isError, refetch, refreshByStudentID };
};


  // React Query hooks
 const useGetPayments = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["sppPayments"],
    queryFn: getPayments,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (res) => res.data, // sesuai BaseResponse { data: ... }
  });

  const refreshPayments = () =>
    queryClient.invalidateQueries({ queryKey: ["sppPayments"] });

  return { data, isLoading, isError, refetch, refreshPayments };
};

  const useGetRecapPayments = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["RecapSPP-Payments"],
    queryFn: getRecapSPPPayment,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (res) => res.data,
  });

  const refreshRecapPayments = () =>
    queryClient.invalidateQueries({ queryKey: ["RecapSPP-Payments"] });

  return { data, isLoading, isError, refetch, refreshRecapPayments };
};

const useCreateSPPPayment = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ payload, silent }: { payload: CreateSppPayment; silent?: boolean }) => {
      const res = await createPayment(payload);
      return { res, silent };
    },
    onSuccess: (data) => {
      if (!data.silent) {
        Swal.fire({
          title: "Berhasil",
          text: "Pembayaran SPP berhasil dibuat",
          icon: "success",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["sppPayments"] });
    },
    onError: (error: any) => {
      Swal.fire({
        title: "Error",
        text: "Pembayaran gagal dibuat: " + error.message,
        icon: "error",
      });
    },
  });
  return { mutate: mutation.mutate, isPending: mutation.isPending };
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
    useCreateSPPPayment,
    useUpdatePayment,
    useDeletePayment,
    useDetailPayment,
    useGetRecapPayments,
    useGetByStudentID,
  };
};
