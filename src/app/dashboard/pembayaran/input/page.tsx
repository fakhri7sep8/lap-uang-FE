"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const kategoriPembayaranList = [
	"SPP",
	"Praktikum",
	"Seragam",
	"Kegiatan",
];

const InputPembayaran = () => {
	const [formData, setFormData] = useState({
		namaSiswa: "Daffa hafidzh firdaus",
		noInduk: "2025AI0934",
		kategoriPembayaran: "SPP",
		nominal: 2500000,
	});

	const handleChange = (field: string, value: string | number) => {
		setFormData({ ...formData, [field]: value });
	};

	const handleSubmit = () => {
		console.log("Data pembayaran disubmit:", formData);
		// Tambahkan logic simpan ke backend/API di sini
	};

	return (
		<section className="w-full bg-white rounded-xl h-full p-8 flex flex-col gap-8">
			<h1 className="font-semibold text-2xl mb-2">Input Pembayaran</h1>
			<div className="flex flex-row gap-6 w-full">
				<div className="w-1/2 flex flex-col gap-1">
					<label className="text-sm font-semibold text-gray-700">
						nama siswa
					</label>
					<Input
						type="text"
						value={formData.namaSiswa}
						readOnly
						className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-base"
					/>
				</div>
				<div className="w-1/2 flex flex-col gap-1">
					<label className="text-sm font-semibold text-gray-700">No Induk</label>
					<Input
						type="text"
						value={formData.noInduk}
						readOnly
						className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-base"
					/>
				</div>
			</div>

			<div className="flex flex-col gap-1 w-full">
				<label className="text-sm font-semibold text-gray-700">
					Kategori Pembayaran
				</label>
				<select
					value={formData.kategoriPembayaran}
					onChange={(e) =>
						handleChange("kategoriPembayaran", e.target.value)
					}
					className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-base"
				>
					{kategoriPembayaranList.map((kategori) => (
						<option key={kategori} value={kategori}>
							{kategori}
						</option>
					))}
				</select>
			</div>

			<div className="flex flex-col gap-1 w-full">
				<label className="text-sm font-semibold text-gray-700">
					Nominal / Cicilan
				</label>
				<div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-6 text-2xl font-bold text-gray-700 flex items-center h-24">
					{`RP.${formData.nominal.toLocaleString("id-ID")},00`}
				</div>
			</div>

			<div className="flex flex-row gap-4 justify-end mt-4">
				<Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-semibold">
					Remove
				</Button>
				<Button
					onClick={handleSubmit}
					className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold"
				>
					Tambah
				</Button>
			</div>
		</section>
	);
};

export default InputPembayaran;