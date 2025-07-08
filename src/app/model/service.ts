export class Service {
    constructor(public id: number = -1, public category_id: number = -1, public name: string = '', public description: string = '', 
        public specifies: string = '', public price: number = 0, public discount: number = 0, public images: string[] = [], 
        public availableEventTypes_id: number[] = [], public duration: number = 0, public reservationDaysDeadline: number = 0, 
        public cancellationDaysDeadline: number = 0, public visible: boolean = false, public available: boolean = false,
        public automaticReserved: boolean = false) {
    }
}  