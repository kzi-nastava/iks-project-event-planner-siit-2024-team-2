export interface PagedResponse<T>{
    content: T[];
    totalPages: number;
    totalElements: number;
  }
  