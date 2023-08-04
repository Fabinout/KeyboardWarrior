export class Unity {

    constructor(maxHealth, side) {
        this.health = {current: maxHealth, max: maxHealth}
        this.side = side;
    }
}