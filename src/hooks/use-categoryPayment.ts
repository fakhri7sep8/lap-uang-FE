import { createCategoryPembayaran } from "@/interface/use-category-pembayaran";
import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export const useCategoryPaymentModule = () => {
  const getCategory = async () => {
    return await axiosClient.get("/payment-types/").then((res) => res.data);
  };

  const createCategory = async (payload: createCategoryPembayaran) => {
    return await axiosClient.post("/payment-types/create", payload);
  };

  const deleteCategory = async (id: string) => {
    return await axiosClient
      .delete(`/payment-types/delete/${id}`)
      .then((res) => res.data);
  };

  const updateCategory = async (id: string, payload: any) => {
    return await axiosClient.patch(`/payment-types/update/${id}`, payload);
  };

  const detailCategory = async (id: string) => {
    return await axiosClient.get(`/payment-types/detail/${id}`);
  };

  const useGetCategory = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ["categoryPayment"],
      queryFn: getCategory,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 2, // data dianggap fresh 2 menit
      gcTime: 1000 * 60 * 10, // disimpan di cache 10 menit
      select: (res) => res.data,
    });

    // fungsi manual untuk refresh data
    const refreshCategory = () =>
      queryClient.invalidateQueries({ queryKey: ["categoryPayment"] });

    return { data, isLoading, isError, refetch, refreshCategory };
  };

  const useCreateCategory = () => {
    const queryClient = useQueryClient(); // ✅ tambahkan ini

    const mutate = useMutation({
      mutationFn: (payload: any) => createCategory(payload),
      onSuccess: async () => {
        Swal.fire({
          title: "Berhasil",
          text: "Kategori pembayaran berhasil dibuat",
          icon: "success",
          confirmButtonText: "OK",
        });

        // 🔄 Langsung refresh data kategori agar muncul tanpa reload
        await queryClient.invalidateQueries({ queryKey: ["categoryPayment"] });
      },
      onError: (error) => {
        Swal.fire({
          title: "Error",
          text: "Kategori pembayaran gagal dibuat: " + error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });

    return { mutate };
  };

  const useDeleteCategory = () => {
    const queryClient = useQueryClient(); // ✅ tambahkan ini

    const mutate = useMutation({
      mutationFn: (id: string) => deleteCategory(id),
      onSuccess: async () => {
        Swal.fire({
          title: "Berhasil",
          text: "Kategori pembayaran berhasil dihapus",
          icon: "success",
          confirmButtonText: "OK",
        });

        // 🔄 Langsung refresh data tanpa reload halaman
        await queryClient.invalidateQueries({ queryKey: ["categoryPayment"] });
      },
      onError: () => {
        Swal.fire({
          title: "Error",
          text: "Kategori pembayaran gagal dihapus",
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });

    return { mutate };
  };

  const useUpdateCategory = (id: string) => {
    const mutate = useMutation({
      mutationFn: (payload: any) => updateCategory(id, payload),
      onSuccess: () => {
        Swal.fire({
          title: "Berhasil",
          text: "Kategori pembayaran berhasil diupdate",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/dashboard/pembayaran/kategori";
        });
      },
      onError: () => {
        Swal.fire({
          title: "Error",
          text: "Kategori pembayaran gagal diupdate",
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });

    return { mutate };
  };
  const useDetailCategory = (id: string) => {
    const { data, isLoading } = useQuery({
      queryFn: () => detailCategory(id),
      queryKey: ["categoryPaymentDetail", id],
      select: (data) => data.data,
    });

    return { data, isLoading };
  };

  return {
    useGetCategory,
    useCreateCategory,
    useDeleteCategory,
    useUpdateCategory,
    useDetailCategory,
  };
};
