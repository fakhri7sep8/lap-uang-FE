import { useExpenseModule } from "./useExpense";
import { useQuery } from "@tanstack/react-query";

export const useAllExpense = () => {
  const { useGetExpense } = useExpenseModule();

  return useQuery({
    queryKey: ["expense-all"],
    queryFn: async () => {
      const categories = [
        "Operasional",
        "Pemeliharaan",
        "Upah Karyawan",
        "Makan",
      ];

      const promises = categories.map((c) => fetch(
        `https://lap-uang-be.vercel.app/expense/${c}`
      ).then((r) => r.json()));

      const results = await Promise.all(promises);

      return results.flatMap((r) => r.data || []);
    },
  });
};
