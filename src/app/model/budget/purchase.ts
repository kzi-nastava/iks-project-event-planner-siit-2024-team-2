import { Product } from "../service-product/product";

export interface Purchase {
    id: number;
    product: Product;
    price: number;
}