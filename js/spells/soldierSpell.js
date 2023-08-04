import {Soldier} from "../unity/soldier";

export class SoldierSpell {
    constructor() {
        this.name = "soldier";
        this.cost = 30;
        this.casted = false;
        this.isBuff = false;
    }

    cast(game) {
        console.log("soldier spell is casted")
        game.add(new Soldier());
    }
}