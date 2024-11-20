export class Service {
    constructor(public id: number, public category: string, public name: string, public description: string, 
        public specifies: string, public price: number, public discount: number, public photos: string[], 
        public eventTypes: string[], public duration: number, public reservationDeadline: number, 
        public cancellationDeadline: number, public visibility: boolean = true, public availability: boolean = true,
        public automaticAcceptance: boolean = true) {
    }
}