export interface PaginationParams {
  _limit: number;
  _page: number;
  total: number;
}

export interface ListResponse<H> {
  data: H[];
  pagination: PaginationParams;
}

export interface ListParam {
  _page: number;
  _limit: number;
  _sort: string;
  _order: 'asc' | 'desc';
  [key: string]: any;
}
