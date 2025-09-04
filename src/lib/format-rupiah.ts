import currency from "currency.js";

export const formatRupiah = (value: number | string) =>
  currency(value || 0, {
    symbol: "Rp",
    separator: ".",
    decimal: ",",
    precision: 0,
  }).format();
