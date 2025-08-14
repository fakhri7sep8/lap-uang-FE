/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCategoryPembayaran } from "@/interface/use-category-pembayaran";
import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCategoryPaymentModule = () => {
  const getCategory = async () => {
    return await axiosClient.get("/payment-types/").then((res) => res.data);
  };


  const createCategory = async (payload: createCategoryPembayaran) => {
    return await axiosClient.post("/payment-types/create", payload);
  };

  const useGetCategory = () => {
    const { data, isLoading } = useQuery({
      queryKey: ["categoryPayment"],
      queryFn: () => getCategory(),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      select: (data) => data,
    });
    return { data, isLoading };
  };


  const useCreateCategory = () => {
    const mutate = useMutation({
      mutationFn: (payload: any) => createCategory(payload),
      onSuccess: (data) => {
        alert("Category created successfully: " + data?.data?.length);
      },
      onError: (error) => {
        alert("Error creating category: " + error.message);
      },
    });
  };

  return { useGetCategory, useCreateCategory };
};
