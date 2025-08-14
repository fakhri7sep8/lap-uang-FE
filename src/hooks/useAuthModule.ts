/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Cookie from "js-cookie";

export const useAuthModule = () => {
  const Login = async (payload: any) => {
    return await axiosClient.post("/auth/login", payload);
  };

  const ChangePassword = async (payload: any) => {
    return await axiosClient.post("/auth/change-password", payload);
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
    const mutation = useMutation({
      mutationFn: (payload: any) => Login(payload),
      onSuccess: (data) => {
        console.log(data);
        Cookie.set("x-auth", data?.data?.meta?.auth?.access_token, { expires: 1 });
        Swal.fire({
          title: "Berhasil!",
          text: "Login berhasil, Anda akan diarahkan ke halaman admin.",
          icon: "success",
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Login gagal! Periksa kembali email dan password Anda.",
          footer: '<a href="#">Kenapa saya mengalami masalah ini?</a>',
        });
      },
    });

    return { ...mutation };
  };

  return { useLogin , useChangePassword };
};
