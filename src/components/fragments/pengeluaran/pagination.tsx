'use client'
import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ totalPages = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const goToPage = (num: number) => {
    if (num >= 1 && num <= totalPages) setCurrentPage(num)
  }

  // Generate pagination with ellipsis
  const paginationNumbers = useMemo(() => {
    const pages = []
    const delta = 1 // how many pages before and after current

    // Always show first page
    pages.push(1)

    // Left ellipsis
    if (currentPage - delta > 2) {
      pages.push("...")
    }

    // Middle pages
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i)
      }
    }

    // Right ellipsis
    if (currentPage + delta < totalPages - 1) {
      pages.push("...")
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }, [currentPage, totalPages])

  return (
    <div className="flex justify-center items-center mt-8">
      <div className="flex items-center gap-2 bg-white shadow-md px-4 py-3 rounded-xl">

        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg border transition-all
            ${currentPage === 1
              ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
              : 'hover:bg-blue-50 border-gray-300 text-gray-600'
            }`}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Numbers */}
        {paginationNumbers.map((num, idx) => (
          <button
            key={idx}
            onClick={() => typeof num === "number" && goToPage(num)}
            disabled={num === "..."}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${num === "..."
                ? "cursor-default text-gray-400"
                : currentPage === num
                  ? "bg-blue-600 text-white shadow-md scale-95"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-blue-50"
              }`}
          >
            {num}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg border transition-all
            ${currentPage === totalPages
              ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
              : 'hover:bg-blue-50 border-gray-300 text-gray-600'
            }`}
        >
          <ChevronRight size={18} />
        </button>

      </div>
    </div>
  )
}

export default Pagination
