/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export const useStudentModule = () => {
  const getStudentData = async () => {
    return await axiosClient.get("/student");
  };

  const createStudent = async (data: any) => {
    return await axiosClient.post("/student/create", data);
  };
  const createStudentBulk = async (data: any) => {
    return await axiosClient.post("/student/createBulk", data);
  };

  const updateStudent = async (data: any, id: string) => {
    return await axiosClient.put(`/student/update/${id}`, data);
  };

  const deleteStudent = async (id: string, payload:any) => {
    return await axiosClient.patch(`/student/updateStatusDelete/${id}`, payload);
  };

  const useCreateBulk = () => {
    const mutate = useMutation({
      mutationFn: (payload: any) => createStudentBulk(payload),
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
        })
      },
      onError: (error) => { 
        if (axios.isAxiosError(error)) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error.response?.data?.message || "Terjadi kesalahan saat menambahkan data siswa",
            confirmButtonColor: "#d33",
          });
        }
      }
    })

    return mutate;
  }

const useCreateStudent = () => {
  const router = useRouter();
  const queryClient = useQueryClient(); // 🧠 tambahkan ini

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => createStudent(data),
    onSuccess: async (data) => {
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data siswa berhasil ditambahkan",
        confirmButtonColor: "#3085d6",
      });

      console.log("Student data created successfully:", data);

      // 🔄 Refresh data student biar langsung muncul di view
      await queryClient.invalidateQueries({ queryKey: ["get-student"] });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menambahkan data siswa",
        confirmButtonColor: "#d33",
      });
      console.log("Error creating student data:", error);
    },
  });

  return { mutate, isPending };
};


 const useUpdateStudent = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient(); // 🧠 tambahkan ini

  const mutate = useMutation({
    mutationFn: (data: any) => updateStudent(data, id),
    onSuccess: async (data) => {
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data siswa berhasil diperbarui",
        timer: 2000,
        showConfirmButton: false,
      });

      // 🔄 refresh cache data siswa
      await queryClient.invalidateQueries({ queryKey: ["get-student"] });

      // 🔁 beri sedikit delay agar cache sempat di-refresh sebelum pindah halaman
      setTimeout(() => {
        router.push("/dashboard/siswa/view");
      }, 300);
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui data siswa",
      });
    },
  });

  return { mutate };
};


  const useDeleteStudent = () => {
    const queryClient = useQueryClient();

    const mutate = useMutation({
      mutationFn: (id: string) => deleteStudent(id, { isDelete: true }),
      onSuccess: (data) => {
        console.log("Delete berhasil", data);
        queryClient.invalidateQueries({ queryKey: ["get-student"] });
      },
      onError: (error) => {
        console.error("Gagal menghapus data siswa:", error);
      },
    });
    return { mutate, mutateAsync: mutate.mutateAsync , isPending: mutate.isPending };
  };

 const useGetStudent = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["get-student"],
    queryFn: getStudentData,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // data dianggap fresh selama 2 menit
    gcTime: 1000 * 60 * 10,   // data disimpan di cache selama 10 menit
    select: (res) => res.data.data || [],
  });

  const refreshStudent = () =>
    queryClient.invalidateQueries({ queryKey: ["get-student"] });

  return { data, isLoading, isError, refetch, refreshStudent };
};

  return {
    useCreateStudent,
    useGetStudent,
    useDeleteStudent,
    useUpdateStudent,
    useCreateBulk
  };
};
