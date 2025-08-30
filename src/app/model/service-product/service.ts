export class Service {
    constructor(public id = -1, public category: any = {}, public name = '', public description = '', 
        public specifies = '', public price = 0, public discount = 0, public images: string[] = [],
        public imageEncodedNames: string[] = [], public serviceProductProvider: any = null,
        public availableEventTypes: any[] = [], public duration = 0, public reservationDaysDeadline = 0, 
        public cancellationDaysDeadline = 0, public visible = false, public available = false,
        public automaticReserved = false, public minEngagementDuration = 0, public maxEngagementDuration = 0) {
    }
}  