export interface User {
    id: number;
    email: string | null;
    userRole: string | null;
    firstName: string | null;
    lastName: string | null;
    address: string | null;
    phoneNumber: string | null;
    image: string | null;
    imageEncodedName: string | null;
}

/*
public class BaseUserDto {
    private long id;
    private String email;
    private UserRole userRole;
    private String firstName;
    private String lastName;
    private String address;
    private String phoneNumber;
    private String image = null;
    private String imageEncodedName = null;
}
*/