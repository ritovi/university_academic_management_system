export type DeleteUserInput = {
    id: string;
};

export class DeleteUserDTO {
    constructor(
        public readonly id: string
    ) {}

    static create(object: DeleteUserInput): [string, undefined] | [undefined, DeleteUserDTO] {
        const { id } = object;

        if (!id) return ["Missing id", undefined];
        if (typeof id !== 'string') return ["Invalid id format", undefined];

        return [undefined, new DeleteUserDTO(id)];
    }
}