import { axiosClient } from "@/lib/axiosClient"
import { useMutation } from "@tanstack/react-query"

export const useAuthModule =() => {
    const Login = async (payload:any) => {
        return await axiosClient.post("/auth/login", payload)
    }

    const useLogin = () => {
        const mutate = useMutation({
            mutationFn: (payload:any) => Login(payload),
            onSuccess: (data) => {
                console.log("Login successful:", data)
            },
            onError: (error) => {
                console.error("Login failed:", error)
            }
        })

        return {mutate}
    }

    return {useLogin}
}