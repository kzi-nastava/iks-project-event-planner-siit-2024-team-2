import { PageMetadata } from "./page-metadata";

export interface PagedModel<T>{
    content: T[];
    page: PageMetadata;
}