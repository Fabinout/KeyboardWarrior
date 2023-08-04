export class StrongerSpell {

    constructor() {
        this.casted = false;
        this.name = "stronger";
        this.cost = 40;
        this.isBuff = true;
    }

    cast(game) {
        console.log("stronger spell is casted")
        this.casted = true;
    }

    buff(unity) {
        unity.speed += 2
        return unity;
    }
}