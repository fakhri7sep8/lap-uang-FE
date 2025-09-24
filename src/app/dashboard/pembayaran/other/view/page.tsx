"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  GraduationCap,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import CardInformation from "@/components/fragments/dashboard/card-information";
import Loader from "@/components/ui/loader";
import { CustomPagination } from "@/components/fragments/dashboard/custom-pagination";
import { useCategoryPaymentModule } from "@/hooks/use-categoryPayment";
import { usePaymentModule } from "@/hooks/use-payment";
import SearchDataTable from "@/components/fragments/dashboard/search-data-table";

const DataSelainSpp = () => {
  const [showCount, setShowCount] = useState<any>(10);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [startIndex, setStartIndex] = useState<any>(0);
  const [searchTerm, setSearchTerm] = useState<any>("");
  const maxVisible = 4;

  // selectedCategory object
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [cicilanData, setCicilanData] = useState<any[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const { useGetCategory } = useCategoryPaymentModule();
  const { data: categories = [], isLoading: isLoadingCategory } =
    useGetCategory() as any;

  const {
    useGetRecapPayments,
    useGetPaymentsByCategory,
    useGetCicilanPayments,
  } = usePaymentModule();
  const { data: recap = [], isLoading, isError } = useGetRecapPayments() as any;

  const { mutate: getPaymentsByCategory, data: paymentsByCategory } =
    useGetPaymentsByCategory() as any;
  const { mutate: getCicilanPayments } = useGetCicilanPayments() as any;

  const selectedCategoryType: any = categories.find(
    (c: any) => c.id === selectedCategory?.id
  )?.type;

  // const getPaymentStatus = (amount: any, nominal: any) => {
  //   if (amount >= nominal) return "LUNAS";
  //   if (amount === 0) return "BELUM BAYAR";
  //   return "BELUM LUNAS";
  // };

  const filteredData: any[] = recap.filter((p: any) =>
    searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );
  const totalPages: any = Math.ceil(filteredData.length / showCount);
  const paginatedData: any[] = filteredData.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  );

  const getStatusBadgeClass = (status: any) => {
    switch ((status || "").toUpperCase()) {
      case "LUNAS":
        return "bg-green-100 text-green-700";
      case "BELUM_LUNAS":
      case "BELUM LUNAS":
        return "bg-yellow-100 text-yellow-700";
      case "TUNGGAKAN":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Ambil data sesuai type: cicilan pakai id, lainnya pakai name
  useEffect(() => {
    if (!selectedCategory) return;

    if (selectedCategoryType === "INSTALLMENT") {
      getCicilanPayments(selectedCategory.id, {
        onSuccess: (data: any) => setCicilanData(data),
      });
    } else {
      getPaymentsByCategory(selectedCategory.name); // pakai name untuk kategori biasa
    }
  }, [selectedCategory, selectedCategoryType]);

  if (isLoading || isLoadingCategory) {
    return (
      <div className="p-6 w-full h-[89vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div className="p-6 text-red-500">Gagal memuat data siswa.</div>;
  }

  const handlePrev = () => startIndex > 0 && setStartIndex(startIndex - 1);
  const handleNext = () =>
    startIndex < categories.length - maxVisible &&
    setStartIndex(startIndex + 1);

  return (
    <section className="flex flex-col gap-10 w-full">
      <section className="grid grid-cols-2 gap-4">
        <CardInformation
          color="blue"
          title="Total Data"
          value={recap.length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color="green"
          title="Lunas"
          value={filteredData.slice(0, showCount).length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      <section className="w-full flex flex-col gap-6 h-full pb-6">
        {/* {tabel} */}
        <SearchDataTable
          title={"Data Pembayaran"}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type={"normal"}
        />

        {/* Carousel */}
        <div className="w-full flex items-center">
          <button
            title="Previous"
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="p-2 bg-white shadow rounded-full hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="overflow-hidden flex-1 mx-2">
            <div
              className="flex gap-4 transition-transform duration-500"
              style={{
                transform: `translateX(-${startIndex * (100 / maxVisible)}%)`,
              }}
            >
              <div
                onClick={() => setSelectedCategory(null)}
                className={`flex-[0_0_calc(100%/4-1rem)] flex justify-center items-center h-16 rounded-xl cursor-pointer ${
                  !selectedCategory ? "bg-blue-700" : "bg-blue-500"
                }`}
              >
                <p className="text-white font-semibold text-xl">Semua</p>
              </div>
              {categories.map((kat: any, i: any) => (
                <div
                  key={i}
                  onClick={() =>
                    setSelectedCategory({ id: kat.id, name: kat.name })
                  }
                  className={`flex-[0_0_calc(100%/4-1rem)] flex justify-center items-center h-16 rounded-xl cursor-pointer ${
                    selectedCategory?.id === kat.id
                      ? "bg-blue-700"
                      : "bg-blue-500"
                  }`}
                >
                  <p className="text-white font-semibold text-xl">{kat.name}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            title="Next"
            onClick={handleNext}
            disabled={startIndex >= categories.length - maxVisible}
            className="p-2 bg-white shadow rounded-full hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Table */}
        <div className="w-full h-full rounded-xl overflow-hidden bg-white px-1 pt-2 pb-4">
          {selectedCategory ? (
            selectedCategoryType === "INSTALLMENT" ? (
              // Cicilan pakai ID
              <Table className="w-full text-gray-700 text-center">
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Sudah Dibayar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cicilanData.length > 0 ? (
                    cicilanData.map((item: any, idx: any) => (
                      <TableRow key={item.studentId}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell>{item.tipeKategori}</TableCell>
                        <TableCell>
                          Rp. {item.jumlahTagihan?.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          Rp. {item.jumlahPembayaran?.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button className="bg-blue-500 text-white">
                            <Download size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-gray-400 py-6"
                      >
                        Tidak ada data cicilan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              // Biasa pakai name
              <Table className="w-full text-gray-700 text-center">
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsByCategory?.data?.length > 0 ? (
                    paymentsByCategory.data.map((item: any, idx: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{item.student?.name}</TableCell>
                        <TableCell>{item.year}</TableCell>
                        <TableCell>{item.type?.name}</TableCell>
                        <TableCell>
                          Rp. {item.amount?.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell className="flex gap-2 justify-center">
                          <Button className="bg-blue-500 text-white">
                            <Download size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-gray-400 py-6"
                      >
                        Tidak ada data untuk kategori ini
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )
          ) : (
            // Semua
            <Table className="w-full h-full table-auto bg-white text-gray-700 text-center">
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  {categories.map((c: any) => (
                    <TableHead key={c.id}>{c.name}</TableHead>
                  ))}
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-gray-400">
                      Data not found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((p: any, idx: any) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        {(currentPage - 1) * showCount + idx + 1}
                      </TableCell>
                      <TableCell>{p.name}</TableCell>
                      {p.payments?.map((pmt: any, i: any) => (
                        <TableCell key={i}>
                          <span
                            className={`inline-block w-24 text-center px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                              pmt.status
                            )}`}
                          >
                            {pmt.status}
                          </span>
                        </TableCell>
                      ))}
                      <TableCell className="flex w-full gap-2 items-center justify-center">
                        <Button className="bg-blue-500 text-white">
                          <Download />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </section>
  );
};

export default DataSelainSpp;
