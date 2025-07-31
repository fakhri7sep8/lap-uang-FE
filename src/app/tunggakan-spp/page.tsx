'use client';

import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

interface SiswaSPP {
    id: string;
    no_induk: string;
    nama: string;
    asrama: string;
    tunggakan: number;
    tarif: number;
}

// Dummy 3 siswa dan ulang 20x = 60 data
const dummyBase: SiswaSPP[] = [
    { id: '1', no_induk: '2025A1001', nama: 'Aulia Ramadhan', asrama: 'A1', tunggakan: 0, tarif: 50000 },
    { id: '2', no_induk: '2025A1002', nama: 'Bayu Pradana', asrama: 'A1', tunggakan: 25000, tarif: 50000 },
    { id: '3', no_induk: '2025A1003', nama: 'Citra Wulandari', asrama: 'A2', tunggakan: 50000, tarif: 50000 },
];

const generateData = () =>
    Array(20)
        .fill(0)
        .flatMap((_, i) =>
            dummyBase.map((item, j) => ({
                ...item,
                id: `${i + 1}-${j + 1}`,
                no_induk: `${item.no_induk.slice(0, 8)}${i}${j}`,
            }))
        );

export default function SPPPage() {
    const originalData = generateData();
    const [data, setData] = useState<SiswaSPP[]>(originalData);
    const [searchNama, setSearchNama] = useState('');
    const [searchInduk, setSearchInduk] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredData = data.filter(
        (item) =>
            item.nama.toLowerCase().includes(searchNama.toLowerCase()) &&
            item.no_induk.toLowerCase().includes(searchInduk.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const resetFilter = () => {
        setSearchNama('');
        setSearchInduk('');
        setCurrentPage(1);
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'SPP');
        XLSX.writeFile(workbook, 'data_spp.xlsx');
    };

    const handleTunggakanChange = (index: number, value: number) => {
        const newData = [...data];
        const realIndex = data.findIndex((d) => d.id === currentData[index].id);
        newData[realIndex].tunggakan = value;
        setData(newData);
    };

    return (
        <main className="p-6 bg-gray-50 min-h-screen">
            {/* Filter */}
            <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
                <h2 className="text-xl font-bold">Tunggakan SPP</h2>
                <div className="flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Masukkan No Induk"
                        value={searchInduk}
                        onChange={(e) => setSearchInduk(e.target.value)}
                        className="border rounded px-3 py-2 w-64"
                    />
                    <input
                        type="text"
                        placeholder="Masukkan Nama Siswa"
                        value={searchNama}
                        onChange={(e) => setSearchNama(e.target.value)}
                        className="border rounded px-3 py-2 w-64"
                    />
                    <button onClick={resetFilter} className="bg-gray-200 text-sm px-4 rounded hover:bg-gray-300">Reset</button>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
                    <div className="bg-green-600 text-white items-center rounded-xl px-4 py-3 w-full md:w-60 flex justify-between">
                        <div className="flex flex-col">
                            <div className="text-lg font-medium">Total Data:</div>
                            <div className="text-3xl font-bold">{data.length}</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-md font-medium">Hasil:</div>
                            <div className="text-2xl font-bold">{filteredData.length}</div>
                        </div>
                    </div>

                    <button
                        onClick={exportExcel}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 w-full md:w-auto"
                    >
                        Export Excel
                    </button>
                </div>

            </div>

            {/* Table */}
            <div className="mt-6 overflow-x-auto border rounded bg-white shadow">
                <table className="w-full text-sm text-center border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-2">No</th>
                            <th className="border px-2 py-2">No Induk</th>
                            <th className="border px-2 py-2">Nama</th>
                            <th className="border px-2 py-2">Asrama</th>
                            <th className="border px-2 py-2">Tunggakan Awal</th>
                            <th className="border px-2 py-2">Tarif SPP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row, i) => (
                            <tr key={row.id}>
                                <td className="border px-2 py-2">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                <td className="border px-2 py-2">{row.no_induk}</td>
                                <td className="border px-2 py-2">{row.nama}</td>
                                <td className="border px-2 py-2">{row.asrama}</td>
                                <td className="border px-2 py-2">
                                    {row.tunggakan.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                                </td>
                                <td className="border px-2 py-2">{row.tarif.toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
                <div className="flex items-center border rounded-full px-4 py-2 gap-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="text-green-700 font-bold text-xl px-2"
                    >
                        &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 rounded-full text-sm font-semibold ${currentPage === i + 1 ? 'bg-green-600 text-white' : 'text-gray-700'
                                } hover:bg-green-200`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="text-green-700 font-bold text-xl px-2"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </main>
    );
}
