export interface GetBudgetExpense {
  id: string;
  tanggal: string;              // ISO Date string
  jenisPengeluaran: string;
  deskripsi?: string;
  amount: number;
  sumberDana?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBudgetExpense {
  tanggal: string;
  jenisPengeluaran: string;
  deskripsi?: string;
  amount: number;
  sumberDana?: string;
  status?: string;
}

export interface UpdateBudgetExpense {
  tanggal?: string;
  jenisPengeluaran?: string;
  deskripsi?: string;
  amount?: number;
  sumberDana?: string;
  status?: string;
}
