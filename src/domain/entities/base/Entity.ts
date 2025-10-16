export abstract class Entity {
    constructor(public readonly id?: string) {}

    equals(entity: Entity): boolean {
        if (!entity) return false;
        if (!(entity instanceof Entity)) return false;
        return this.id === entity.id;
    }
}