export type CreateLabReservationInput = {
    labGroupId: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    purpose: string;
    weekNumber: number;
};

export class CreateLabReservationDTO {
    constructor(
        public readonly labGroupId: string,
        public readonly reservationDate: Date,
        public readonly startTime: string,
        public readonly endTime: string,
        public readonly purpose: string,
        public readonly weekNumber: number
    ) {}

    static create(object: CreateLabReservationInput): [string, undefined] | [undefined, CreateLabReservationDTO] {
        const {
            labGroupId,
            reservationDate,
            startTime,
            endTime,
            purpose,
            weekNumber
        } = object;

        if (!labGroupId) return ["Missing labGroupId", undefined];
        if (!reservationDate) return ["Missing reservationDate", undefined];
        if (!startTime) return ["Missing startTime", undefined];
        if (!endTime) return ["Missing endTime", undefined];
        if (!purpose) return ["Missing purpose", undefined];
        if (weekNumber === undefined) return ["Missing weekNumber", undefined];

        const date = new Date(reservationDate);
        if (isNaN(date.getTime())) return ["Invalid reservationDate", undefined];

        // Validate time format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(startTime)) return ["Invalid startTime format (use HH:MM)", undefined];
        if (!timeRegex.test(endTime)) return ["Invalid endTime format (use HH:MM)", undefined];

        return [
            undefined,
            new CreateLabReservationDTO(
                labGroupId,
                date,
                startTime,
                endTime,
                purpose,
                weekNumber
            )
        ];
    }
}