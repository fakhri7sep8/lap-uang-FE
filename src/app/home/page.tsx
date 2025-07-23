"use client";

export default function Home() {
  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Kotak kecil atas */}
      <div className="flex gap-4">
        <div className="flex-1 h-24 bg-blue-50 rounded-lg shadow" />
        <div className="flex-1 h-24 bg-blue-50 rounded-lg shadow" />
        <div className="flex-1 h-24 bg-blue-50 rounded-lg shadow" />
        <div className="flex-1 h-24 bg-blue-50 rounded-lg shadow" />
      </div>
      {/* Kotak besar bawah */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 h-64 bg-gray-100 rounded-lg shadow" />
        <div className="h-64 bg-gray-100 rounded-lg shadow" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-56 bg-gray-100 rounded-lg shadow" />
        <div className="h-56 bg-gray-100 rounded-lg shadow" />
      </div>
    </div>
  );
}