/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useStudentModule = () => {
  const getStudentData = async () => {
    return await axiosClient.get("/student/getAllStudent");
  };

  const createStudent = async (data: any) => {
    return await axiosClient.post("/student/create", data);
  };

  const updateStudent = async (data: any, id: string) => {
    return await axiosClient.put(`/student/update/${id}`, data);
  };

  const deleteStudent = async (data: any, id: string) => {
    return await axiosClient.delete(`/student/delete/${id}`, { data });
  };

  const useCreateStudent = () => {
    const mutate = useMutation({
      mutationFn: (data: any) => createStudent(data),
      onSuccess: (data) => {
        console.log("Student data created successfully:", data);
      },
      onError: (error) => {
        console.error("Failed to create student data:", error);
      },
    });
    return { mutate };
  };

  const useUpdateStudent = (id: string) => {
    const mutate = useMutation({
      mutationFn: (data: any) => updateStudent(data, id),
      onSuccess: (data) => {
        console.log("Update berhasil", data);
      },
      onError: (error) => {
        console.error("Gagal memperbarui data siswa:", error);
      },
    });
    return { mutate };
  };

  const useDeleteStudent = (id: string) => {
    const mutate = useMutation({
      mutationFn: (data: any) => deleteStudent(data, id),
      onSuccess: (data) => {
        console.log("Delete berhasil", data);
      },
      onError: (error) => {
        console.error("Gagal menghapus data siswa:", error);
      },
    });
    return { mutate };
  };

  const useGetStudent = () => {
    const { isLoading, isError, data } = useQuery({
      queryKey: ["get-student"],
      queryFn: () => getStudentData(),
      select: (data) => data.data,
    });

    return { isLoading, isError, data };
  };

  return { useCreateStudent, useGetStudent, useDeleteStudent, useUpdateStudent };
};
