export function getStatusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "lunas":
      return "bg-green-100 text-green-500";
    case "belum lunas":
      return "bg-yellow-100 text-yellow-500";
    case "tunggakan":
      return "bg-red-100 text-red-500";
    default:
      return "bg-gray-100 text-gray-500"; // fallback kalau status tidak dikenali
  }
}
