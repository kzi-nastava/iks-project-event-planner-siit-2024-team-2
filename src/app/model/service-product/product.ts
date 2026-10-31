import { ServiceProduct } from "./service-product";

export interface Product extends ServiceProduct {
    imageEncodedNames: string[] | null;
}

/*
public class ProductDto {
    private long id;
    private ServiceProductProviderDto serviceProductProvider;
    private boolean available;
    private double price;
    private double discount;
    private String name;
    private String description;
    private List<String> images;
    private List<String> imageEncodedNames;
}
*/