export interface ListResponse<H> {
  data: H[];
  last: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
