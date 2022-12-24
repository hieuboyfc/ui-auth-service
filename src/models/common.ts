export interface ListResponse<H> {
  result: H[];
  last: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
