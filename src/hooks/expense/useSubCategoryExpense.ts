import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export const useSubCategoryExpenseModule = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const getAll = async (params?: any) =>
    axiosClient.get("/subcategory", { params });
  const getById = async (id: number) => axiosClient.get(`/subcategory/${id}`);
  const create = async (data: any) => axiosClient.post("/subcategory", data);
  const update = async (id: number, data: any) =>
    axiosClient.patch(`/subcategory/${id}`, data);
  const softDelete = async (id: number, isDelete: boolean) =>
    axiosClient.patch(`/subcategory/${id}/isdelete?isDelete=${isDelete}`);
  const remove = async (id: number) => axiosClient.delete(`/subcategory/${id}`);

  const useGetSubCategory = (params?: any) =>
    useQuery({
      queryKey: ["get-subcategory", params],
      queryFn: () => getAll(params),
      select: (res) => res.data,
    });

  const useCreateSubCategory = () =>
    useMutation({
      mutationFn: create,
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Subkategori berhasil ditambahkan",
        });
        queryClient.invalidateQueries({ queryKey: ["get-subcategory"] });
      },
    });

  const useUpdateSubCategory = (id: number) =>
    useMutation({
      mutationFn: (data: any) => update(id, data),
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Subkategori berhasil diperbarui",
        });
        router.push("/dashboard/subcategory");
      },
    });

  const useDeleteSubCategory = () =>
    useMutation({
      mutationFn: (id: number) => remove(id),
      onSuccess: () => {
        Swal.fire({ icon: "success", title: "Subkategori dihapus" });
        queryClient.invalidateQueries({ queryKey: ["get-subcategory"] });
      },
    });

  const useSoftDeleteSubCategory = () =>
    useMutation({
      mutationFn: ({ id, isDelete }: { id: number; isDelete: boolean }) =>
        softDelete(id, isDelete),
      onSuccess: () => {
        Swal.fire({ icon: "success", title: "Status subkategori diperbarui" });
        queryClient.invalidateQueries({ queryKey: ["get-subcategory"] });
      },
    });

  return {
    useGetSubCategory,
    useCreateSubCategory,
    useUpdateSubCategory,
    useDeleteSubCategory,
    useSoftDeleteSubCategory,
  };
};
