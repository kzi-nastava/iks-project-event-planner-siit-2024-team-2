import { Service } from "../../model/service-product/service";

export interface PendingBookingDto {
    id: number,
    service: Service,
    price: number,
    date: number,
    duration: number,
    createdAt: Date,
    bookerName: string | null,
    bookerEmail: string | null,
    hidden: boolean,
    hiding: boolean
}

/*
public class PendingBookingDto {
    private long id;
    private ServiceDto service;
    private double price;
    private long date;
    private double duration;
    private Instant createdAt;
    private String bookerName;
    private String bookerEmail;
}
*/