'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from '@/components/ui/pagination'

type CustomPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

// 🔑 Helper buat bikin daftar halaman + ellipsis
function getPageNumbers (currentPage: number, totalPages: number) {
  const pages: (number | string)[] = []

  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)

    if (currentPage > 3) {
      pages.push('ellipsis-prev')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis-next')
    }

    pages.push(totalPages)
  }

  return pages
}

export function CustomPagination ({
  currentPage,
  totalPages,
  onPageChange
}: CustomPaginationProps) {
  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <Pagination>
      <PaginationContent className='justify-center mt-4'>
        {/* Prev */}
        <PaginationItem>
          <PaginationPrevious
            href='#'
            aria-disabled={currentPage === 1}
            onClick={e => {
              e.preventDefault()
              if (currentPage > 1) onPageChange(currentPage - 1)
            }}
          />
        </PaginationItem>

        {/* Page numbers + Ellipsis */}
        {pageNumbers.map((page, i) => (
          <PaginationItem key={i}>
            {typeof page === 'number' ? (
              <PaginationLink
                href='#'
                isActive={currentPage === page}
                onClick={e => {
                  e.preventDefault()
                  onPageChange(page)
                }}
              >
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href='#'
            aria-disabled={currentPage === totalPages}
            onClick={e => {
              e.preventDefault()
              if (currentPage < totalPages) onPageChange(currentPage + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
