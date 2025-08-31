import { EventType } from "../../../model/event/event-type";
import { ServiceProductCategory } from "../../../model/service-product/service-product-category";
import { ServiceProductProvider } from "../../../model/user/service-product-provider";

export interface ProductDetailsDto {
    serviceProductProvider: ServiceProductProvider | null;
    available: boolean | null;
    visible: boolean | null;
    price: number | null;
    discount: number | null;
    name: string | null;
    description: string | null;
    serviceProductCategoryDto: ServiceProductCategory | null;
    eventTypes: EventType[] | null;
    images: string[] | null;
    imageEncodedNames: string[] | null;
}

/*
public class ProductDetailsDto {
    private ServiceProductProviderDto serviceProductProvider;
    private boolean available;
    private boolean visible;
    private double price;
    private double discount;
    private String name;
    private String description;
    private ServiceProductCategoryDto serviceProductCategoryDto;
    private List<EventTypeDto> eventTypes;
    private List<String> images;
    private List<String> imageEncodedNames;
*/