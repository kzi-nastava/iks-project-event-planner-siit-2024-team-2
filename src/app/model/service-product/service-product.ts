import { EventType } from "../event/event-type";
import { ServiceProductProvider } from "../user/service-product-provider";
import { ServiceProductCategory } from "./service-product-category";

export interface ServiceProduct {
    id: number;
    name: string | null;
    description: string | null;
    category: ServiceProductCategory | null;
    available: boolean | null;
    visible: boolean | null;
    price: number | null;
    discount: number | null;
    images: string[] | null;
    availableEventTypes: EventType[] | null;
    serviceProductProvider: ServiceProductProvider | null;
    dtype: "Service" | "Product" | null;
}
/*
    private ServiceProductCategory category;
    private boolean available;
    private boolean visible;
    private double price;
    private double discount;
    private String name;
    private String description;
    private List<String> images;
    private List<EventType> availableEventTypes;
    private ServiceProductProvider serviceProductProvider;
*/