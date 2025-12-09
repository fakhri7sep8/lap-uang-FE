import { axiosClient } from "@/lib/axiosClient"
import { useQuery } from "@tanstack/react-query"

export const useDashboardModule = () => {
    const getRecapYear= async (year:any) => {
        return await axiosClient.get(`/recap/${year}`).then(res=> res.data)
    }


    const useDataDashboard = (year:any) => {
        const { data,isLoading,isError} = useQuery({
            queryKey: ["dataDashboard", year],
            queryFn: () => getRecapYear(year),
            select: res => res.data
        })

        return {data, isLoading,isError}
    }

    return {
        useDataDashboard
    }
}