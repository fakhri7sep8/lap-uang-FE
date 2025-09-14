import * as XLSX from 'xlsx'

interface OptionExcel {
    with?: {
        opp: boolean,
        json: boolean
    },
    maxSize: number
}

export const readerExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
  return new Promise<{ json: any; oop: XLSX.WorkSheet } | null>(resolve => {
    const file = e.target.files?.[0]
    if (!file) return resolve(null)

    const reader = new FileReader()

    reader.onload = (evt: any) => {
      const data = evt.target?.result
      const excel = XLSX.read(data, { type: 'binary' })
      const sheetName = excel.SheetNames[0]
      const oopVersion = excel.Sheets[sheetName]
      const jsonVersion = XLSX.utils.sheet_to_json(oopVersion)

      resolve({ json: jsonVersion, oop: oopVersion })
    }

    reader.readAsBinaryString(file)
  })
}
