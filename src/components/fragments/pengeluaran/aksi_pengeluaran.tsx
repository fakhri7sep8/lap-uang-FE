import { Download, Eye, Pencil } from 'lucide-react'
import React from 'react'

const AksiPengeluaran = () => {
  return (
    <div className="flex justify-center">
                        <div className="flex items-center gap-2">
                          <button
                            title="Edit"
                            className="flex items-center justify-center border border-gray-200 rounded-md p-1.5 transition-all duration-150 ease-in-out hover:shadow-sm hover:scale-105 bg-white group"
                          >
                            <Pencil size={14} className="text-blue-600 group-hover:text-blue-700 transition-colors" />
                          </button>
    
                          <button
                            title="Detail"
                            className="flex items-center justify-center border border-gray-200 rounded-md p-1.5 transition-all duration-150 ease-in-out hover:shadow-sm hover:scale-105 bg-white group"
                          >
                            <Eye size={14} className="text-green-600 group-hover:text-green-700 transition-colors" />
                          </button>
    
                          <button
                            title="Download Kwitansi"
                            className="flex items-center justify-center border border-gray-200 rounded-md p-1.5 transition-all duration-150 ease-in-out hover:shadow-sm hover:scale-105 bg-white group"
                          >
                            <Download size={14} className="text-orange-600 group-hover:text-orange-700 transition-colors" />
                          </button>
                        </div>
                      </div>
  )
}

export default AksiPengeluaran