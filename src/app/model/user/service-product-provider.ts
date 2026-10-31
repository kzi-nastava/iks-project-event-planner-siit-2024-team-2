import { User } from "./user";

export interface ServiceProductProvider extends User {
    companyName: string | null;
    companyDescription: string | null;
}

/*
public class ServiceProductProviderDto {
    private long id;
    private String email;
    private UserRole userRole;
    private String firstName;
    private String lastName;
    private String address;
    private String phoneNumber;
    private String companyName;
    private String companyDescription;
    private String image = null;
    private String imageEncodedName = null;
}
*/