export function formatRupiah(value?: number | null) {
  if (!value) {
    return "Harga belum tersedia";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatSimilarity(value: number) {
  return `${Math.round(value * 100)}%`;
}
