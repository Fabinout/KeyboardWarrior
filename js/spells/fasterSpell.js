export class FasterSpell {

    constructor() {
        this.casted = false;
        this.name = "faster";
        this.cost = 20;
        this.isBuff = true;
    }

    cast(game) {
        console.log("faster spell is casted")
        this.casted = true;
    }

    buff(unity) {
        unity.speed += 2
        return unity;
    }
}