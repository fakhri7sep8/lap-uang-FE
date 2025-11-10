// src/hooks/useArrears.ts
"use client";

import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

// DTO sesuai backend
export interface CreateArrearDto {
  studentId: string;
  kategori: string;
  nominal: number;
  bulan: number;
}

export const useArrearsModule = () => {
  const getArrears = async () => {
    return await axiosClient.get("/arrears/semua").then((res) => res.data);
  };

  const detailArrear = async (id: string) => {
    return await axiosClient
      .get(`/arrears/detail/${id}`)
      .then((res) => res.data);
  };

  const createArrear = async (payload: CreateArrearDto) => {
    return await axiosClient
      .post("/arrears/tambah", payload)
      .then((res) => res.data);
  };

  const createBulkArrears = async (payload: CreateArrearDto[]) => {
    return await axiosClient
      .post("/arrears/tambah-banyak", payload)
      .then((res) => res.data);
  };

  const updateArrear = async (
    id: string,
    payload: Partial<CreateArrearDto>
  ) => {
    return await axiosClient
      .put(`/arrears/update/${id}`, payload)
      .then((res) => res.data);
  };

  const deleteArrear = async (id: string) => {
    return await axiosClient
      .delete(`/arrears/hapus/${id}`)
      .then((res) => res.data);
  };

  const deleteBulkArrears = async (ids: string[]) => {
    return await axiosClient
      .delete(`/arrears/hapus-banyak`, { data: { ids } })
      .then((res) => res.data);
  };

  const useGetArrears = () => {
    const queryClient = useQueryClient(); // supaya bisa invalidate manual juga

    const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ["arrears"],
      queryFn: getArrears,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      select: (res) => res.data,
    });

    // fungsi tambahan kalau mau refetch manual
    const refreshArrears = () =>
      queryClient.invalidateQueries({ queryKey: ["arrears"] });

    return { data, isLoading, isError, refetch, refreshArrears };
  };

  const useDetailArrear = (id: string) => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ["arrear-detail", id],
      queryFn: () => detailArrear(id),
      enabled: !!id,
      select: (res) => res.data,
    });
    return { data, isLoading, isError };
  };

  // hooks mutation
  const useCreateArrear = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: CreateArrearDto) => createArrear(payload),
      onSuccess: () => {
        Swal.fire("Berhasil", "Tunggakan berhasil ditambahkan", "success");
        queryClient.invalidateQueries({ queryKey: ["arrears"] });
      },
      onError: (error: any) => {
        Swal.fire("Error", "Gagal menambahkan: " + error.message, "error");
      },
    });
  };

  const useCreateBulkArrears = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: CreateArrearDto[]) => createBulkArrears(payload),
      onSuccess: () => {
        Swal.fire(
          "Berhasil",
          "Tunggakan banyak berhasil ditambahkan",
          "success"
        );
        queryClient.invalidateQueries({ queryKey: ["arrears"] });
      },
      onError: (error: any) => {
        Swal.fire(
          "Error",
          "Gagal menambahkan banyak: " + error.message,
          "error"
        );
      },
    });
  };

  const useUpdateArrear = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Partial<CreateArrearDto>;
      }) => updateArrear(id, payload),
      onSuccess: () => {
        Swal.fire("Berhasil", "Tunggakan berhasil diupdate", "success");
        queryClient.invalidateQueries({ queryKey: ["arrears"] });
        queryClient.invalidateQueries({ queryKey: ["arrear-detail"] });
      },
      onError: (error: any) => {
        Swal.fire("Error", "Gagal mengupdate: " + error.message, "error");
      },
    });
  };

  const useDeleteArrear = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => deleteArrear(id),
      onSuccess: () => {
        Swal.fire("Berhasil", "Tunggakan berhasil dihapus", "success");
        queryClient.invalidateQueries({ queryKey: ["arrears"] });
      },
      onError: (error: any) => {
        Swal.fire("Error", "Gagal menghapus: " + error.message, "error");
      },
    });
  };

  const useDeleteBulkArrears = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (ids: string[]) => deleteBulkArrears(ids),
      onSuccess: () => {
        Swal.fire("Berhasil", "Tunggakan banyak berhasil dihapus", "success");
        queryClient.invalidateQueries({ queryKey: ["arrears"] });
      },
      onError: (error: any) => {
        Swal.fire("Error", "Gagal menghapus banyak: " + error.message, "error");
      },
    });
  };

  return {
    useGetArrears,
    useDetailArrear,
    useCreateArrear,
    useCreateBulkArrears,
    useUpdateArrear,
    useDeleteArrear,
    useDeleteBulkArrears,
  };
};
