export interface Theater {
    id: string;
    name: string;
    seatArrangement: Seat[][];
}

export enum SeatStatus {
    Booked = 'Booked',
    Available = 'Available',
    Blocked = 'Blocked',
    Selected = 'Selected',
    EmptySpot = 'EmptySpot',
}


export interface Seat {
    rowID: string;
    columnID: string;
    status: SeatStatus;
    BookedBy?: string;
}