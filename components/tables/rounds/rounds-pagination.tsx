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
  const currentPage = Number(page) || 1;
  const totalPages = Math.ceil(count / roundsPerPage);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationPrevious href={`/rounds?page=${currentPage - 1}`} />
          </PaginationItem>
        )}
        {visiblePages.map((page, i) =>
          page === '...' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={`/rounds?page=${page}`}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext href={`/rounds?page=${currentPage + 1}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
