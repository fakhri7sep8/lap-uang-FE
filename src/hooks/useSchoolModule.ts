/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSchoolModule = () => {
  const getSchoolData = async () => {
    return await axiosClient.get("/school/data");
  };

  const createSchool = async (data:any) => {
    return await axiosClient.post("/school/create", data);
  };

  const updateSchool = async (data:any , id:string) => {
    return await axiosClient.put(`/school/update/${id}`, data)
  }
  
  const DeleteSchool = async (data:any , id:string) => {
    return await axiosClient.delete(`/school/delete/${id}` , data)
  }

  const useCreateSchool = () => {
    const mutate = useMutation({
      mutationFn: (data:any) => createSchool(data),
      onSuccess: (data) => {
        console.log("School data fetched successfully:", data);
      },
      onError: (error) => {
        console.error("Failed to fetch school data:", error);
      },
    });
    return { mutate };
  };

  const useUpdateSchool = (id:string) => {
    const mutate = useMutation({
      mutationFn: (data:any) => updateSchool(data, id),
      onSuccess: (data) => {
        console.log("Update berhasil", data);
      },
      onError: (error) => {
        console.error("Gagal memperbarui data sekolah:", error);
      },
    });
    return { mutate };
  };

  const useDeleteSchool = (id:string) => {
    const mutate = useMutation({
      mutationFn: (data:any) => DeleteSchool(data, id),
      onSuccess: (data) => {
        console.log("Delete berhasil", data);
      },
      onError: (error) => {
        console.error("Gagal menghapus data sekolah:", error);
      },
    });
    return { mutate };
  };

  
  const useGetSchool = () => {
    const {isLoading, isError, data} = useQuery({
      queryKey: ["get-school"],
      queryFn: () => getSchoolData(),
      select: (data) => data.data,
    });

    return {isLoading, isError, data}
  };

  return { useCreateSchool, useGetSchool , useDeleteSchool , useUpdateSchool };
};
