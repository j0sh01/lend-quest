import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function DataPagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = '' 
}: DataPaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    if (totalPages > 0) {
      rangeWithDots.push(1);
    }

    // Calculate range around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Add ellipsis and range if needed
    if (currentPage - delta > 2) {
      rangeWithDots.push('...');
    }

    rangeWithDots.push(...range);

    // Add ellipsis and last page if needed
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...');
    }

    // Always show last page (if different from first)
    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    // Remove duplicates
    return rangeWithDots.filter((page, index, arr) => 
      index === 0 || page !== arr[index - 1]
    );
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {visiblePages.map((page, index) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => onPageChange(page as number)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

interface PaginationInfoProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  className?: string;
}

export function PaginationInfo({ currentPage, pageSize, totalItems, className = '' }: PaginationInfoProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      Showing {startItem} to {endItem} of {totalItems} results
    </div>
  );
}

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  className?: string;
}

export function PaginationWrapper({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  showInfo = true,
  className = ''
}: PaginationWrapperProps) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 ${className}`}>
      {showInfo && (
        <PaginationInfo
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
        />
      )}
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
