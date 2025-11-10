/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    const queryClient = useQueryClient();
    const mutate = useMutation({
      mutationFn: (data:any) => DeleteSchool(data, id),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["schools"] });
        console.log("Delete berhasil", data);
      },
      onError: (error) => {
        console.error("Gagal menghapus data sekolah:", error);
      },
    });
    return { mutate };
  };

  
  const useGetSchool = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["get-school"],
    queryFn: getSchoolData,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // data fresh 2 menit
    gcTime: 1000 * 60 * 10, // disimpan di cache 10 menit
    select: (res) => res.data,
  });

  const refreshSchool = () =>
    queryClient.invalidateQueries({ queryKey: ["get-school"] });

  return { data, isLoading, isError, refetch, refreshSchool };
};


  return { useCreateSchool, useGetSchool , useDeleteSchool , useUpdateSchool };
};
