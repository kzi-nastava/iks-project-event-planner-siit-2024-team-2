export interface EventDto {
    name: string | null,
    description: string | null,
    eventTypeId: number | null,
    eventOrganizerId: number | null,
    maxAttendances: number | null,
    open: boolean | null,
    longitude: number | null,
    latitude: number | null,
    date: string | null,
    activityIds: number[] | null,
    budgetIds: number[] | null,
    invitationEmails: string[] | null
}

/*
public class EventNoIdDto {
    private String name;
    private String description;
    private long eventTypeId;
    private long eventOrganizerId;
    private int maxAttendances;
    private boolean open;
    private double longitude;
    private double latitude;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date date;
    private List<Long> activityIds;
    private List<Long> budgetIds;
    private List<@Email String> invitationEmails;
}
*/