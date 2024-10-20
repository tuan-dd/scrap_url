export class ListResponseDto<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: T[];
}
