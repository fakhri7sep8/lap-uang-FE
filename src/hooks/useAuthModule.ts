/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

export const useAuthModule = () => {
  const Login = async (payload: any) => {
    return await axiosClient.post("/auth/login", payload);
  };

  const changePassUser = async (payload: any, id: string) => {
    return await axiosClient.post(`/auth/change/password/${id}`, payload);
  };

  const ChangePassword = async (payload: any) => {
    return await axiosClient.post("/auth/change-password", payload);
  };

  const useChangePassUser = () => {
    const mutation = useMutation({
      mutationFn: (payload: any) => changePassUser(payload.data, payload.id),
      onSuccess: (data) => {
        Swal.fire({
          title: "Berhasil!",
          text: "Berhasil Ganti Password",
          icon: "success",
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "gagal ganti password",
          footer: '<a href="#">Kenapa saya mengalami masalah ini?</a>',
        });
      },
    });
    return mutation
  };

  const useChangePassword = () => {
    const mutation = useMutation({
      mutationFn: (payload: any) => ChangePassword(payload),
      onSuccess: (data) => {
        console.log(data);
        Swal.fire({
          title: "Berhasil!",
          text: "Berhasil Ganti Password",
          icon: "success",
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "gagal ganti password",
          footer: '<a href="#">Kenapa saya mengalami masalah ini?</a>',
        });
      },
    });
    return mutation;
  };

  const useLogin = () => {
    const router = useRouter();

    const mutation = useMutation({
      mutationFn: Login,
      onSuccess: (data) => {
        Cookie.set("x-auth", data?.data?.meta?.auth?.access_token, {
          expires: 1,
        });

        Swal.fire({
          title: "Berhasil!",
          text: "Login berhasil.",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });

        // ⏳ Redirect langsung tanpa menunggu Swal
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email atau password salah.",
        });
      },
    });

    return { ...mutation };
  };

  return { useLogin, useChangePassword, useChangePassUser };
};
