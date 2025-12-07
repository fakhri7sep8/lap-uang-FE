import currency from "currency.js";

export const formatRupiah = (value: number) =>
  currency(value, {
    symbol: "Rp ",
    separator: ".",
    decimal: ",",
    
  }).format();
