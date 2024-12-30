import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useTranslation } from '@/lib/TranslationProvider';

interface SharedPaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  pageLimit?: number;
  onPageLimitChange?: (page: number) => void;
  justifyEnd?: boolean;
}

const SharedPagination: React.FC<SharedPaginationProps> = ({
  currentPage,
  totalPages: rawTotalPages = 1,
  onPageChange,
  pageLimit = 10,
  justifyEnd,
  onPageLimitChange = () => {},
}) => {
  const { translate } = useTranslation();
  const totalPages = rawTotalPages || 1;

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) onPageChange(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    for (let page = 1; page <= totalPages; page++) {
      if (
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 1 && page <= currentPage + 1)
      ) {
        items.push(
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(page)}
              className={cn(
                page === currentPage &&
                  'bg-primary text-white hover:bg-primary/90 hover:text-primary-foreground'
              )}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (page === currentPage - 2 && currentPage - 3 > 1) ||
        (page === currentPage + 2 && currentPage + 3 < totalPages)
      ) {
        items.push(<PaginationEllipsis key={page} />);
      }
    }
    return items;
  };

  return (
    <Pagination className={cn('relative', justifyEnd && ' justify-end')}>
      <PaginationContent>
        <div className="absolute left-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-400">
              {translate('page.pagination.perpage')}
            </p>
            <Select
              value={`${pageLimit}`}
              onValueChange={(page) => onPageLimitChange(Number(page))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={translate('page.pagination.select')}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageLimit) => (
                  <SelectItem key={pageLimit} value={`${pageLimit}`}>
                    {pageLimit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevious}
            className={cn(
              currentPage === 1 && 'pointer-events-none opacity-50'
            )}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        {renderPaginationItems()}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            className={cn(
              currentPage === totalPages && 'pointer-events-none opacity-50'
            )}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default SharedPagination;
