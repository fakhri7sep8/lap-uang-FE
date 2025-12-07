import { axiosClient } from "@/lib/axiosClient"
import { useQuery } from "@tanstack/react-query"

export const useDashboardModule = () => {
    const getRecapYear= async () => {
        const year = new Date().getFullYear()
        return await axiosClient.get(`/recap/${year}`).then(res=> res.data)
    }


    const useDataDashboard = () => {
        const { data,isLoading,isError} = useQuery({
            queryKey: ["dataDashboard"],
            queryFn: () => getRecapYear(),
            select: res => res.data
        })

        return {data, isLoading,isError}
    }

    return {
        useDataDashboard
    }
}