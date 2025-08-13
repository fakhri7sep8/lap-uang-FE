import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useStudentModule = () => {
  const getStudentData = async () => {
    return await axiosClient.get("/student");
  };

  const createStudent = async (data: any) => {
    return await axiosClient.post("/student/create", data);
  };

  const updateStudent = async (data: any, id: string) => {
    return await axiosClient.put(`/student/update/${id}`, data);
  };

  const deleteStudent = async ( id: string) => {
    return await axiosClient.delete(`/student/delete/${id}`);
  };

  const useCreateStudent = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => createStudent(data),
    onSuccess: (data) => {
      console.log("Student data created successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to create student data:", error);
    },
  });
  return mutation; // return object lengkap mutation
};

  const useUpdateStudent = (id:string) => {
    const mutate = useMutation({
      mutationFn: (data:any) => updateStudent(data, id),
      onSuccess: (data) => {
        alert("berhasil")
      },
      onError: (error) => {
        console.error("Gagal memperbarui data siswa:", error);
      },
    });
    return { mutate };
  };

  const useDeleteStudent = () => {
    const mutate = useMutation({
      mutationFn: (id:string) => deleteStudent(id),
      onSuccess: (data) => {
        console.log("Delete berhasil", data);
      },
      onError: (error) => {
        console.error("Gagal menghapus data siswa:", error);
      },
    });
  return { mutate, mutateAsync: mutate.mutateAsync };   };

  const useGetStudent = () => {
    const { isLoading, isError, data } = useQuery({
      queryKey: ["get-student"],
      queryFn: () => getStudentData(),
      select: (res) => res.data.data || [], // langsung array siswa
    });

    return { isLoading, isError, data };
  };

  return {
    useCreateStudent,
    useGetStudent,
    useDeleteStudent,
    useUpdateStudent,
  };
};
