'use client';

import { useSearchParams } from 'next/navigation';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getVisiblePages } from '@/lib/utilities';

type RoundsPaginationProps = {
  page: number | undefined;
  count: number;
  roundsPerPage: number;
};

export function RoundsPagination({ page, count, roundsPerPage }: RoundsPaginationProps) {
  const searchParams = useSearchParams();

  const currentPage = Number(page) || 1;
  const totalPages = Math.ceil(count / roundsPerPage);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  const changePageHandler = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return '/rounds?page=1';
    }

    const currentSearchParams = new URLSearchParams(searchParams);
    currentSearchParams.set('page', pageNumber.toString());

    return `/rounds?${currentSearchParams.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationPrevious href={changePageHandler(currentPage - 1)} />
          </PaginationItem>
        )}
        {visiblePages.map((pageNumber, index) =>
          pageNumber === '...' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={changePageHandler(pageNumber)}
                isActive={currentPage === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {currentPage !== totalPages && (
          <PaginationItem>
            <PaginationNext href={changePageHandler(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
