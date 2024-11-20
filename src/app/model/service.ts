export class Service {
    constructor(public id: number = -1, public category: string = "Music", public name: string = '', public description: string = '', 
        public specifies: string = '', public price: number = 0, public discount: number = 0, public photos: string[] = [], 
        public eventTypes: string[] = [], public duration: number = 0, public reservationDeadline: number = 0, 
        public cancellationDeadline: number = 0, public visibility: boolean = false, public availability: boolean = false,
        public automaticAcceptance: boolean = false) {
    }
}