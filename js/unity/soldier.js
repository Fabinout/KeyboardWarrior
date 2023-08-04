import {Unity} from "./unity";
import {ACTIONS} from "../game";

export class Soldier extends Unity {

    constructor(side) {
        super(50, side);
        this.position = 0;
        this.size = 1;
        this.speed = 2;
        this.health = {current: 50, max: 50}
        this.action = ACTIONS.moving;
        this.swordUp = true;
        this.tick = 0
        this.swordAnimationLength = 32;
        this.attackDamage = 3;
    }

    draw(context) {
        context.save()
        context.translate(this.position + 140, 542);
        context.fillRect(0, 0, 20, 40)

        context.beginPath();
        context.fillStyle = "bisque"; // #ffe4c4
        context.arc(10, -5, 8, 0, Math.PI * 2, true); // draw circle for head
        // (x,y) center, radius, start angle, end angle, anticlockwise
        context.fill();
        context.beginPath()
        context.lineWidth = 4;
        context.fillStyle = "black";

        let swordStart = {x: 20, y: 10}
        context.translate(5, 0)
        let swordSize = {w: 10, h: 40}
        context.translate(swordStart.x, swordStart.y);

        if (this.swordUp) {
            context.rotate(45 * Math.PI / 180)
            context.fillRect(0, 0, 5, -40)
            context.fillRect(-7, -15, 20, 5)
            context.setTransform(1, 0, 0, 1, 0, 0);
            if (this.tick % this.swordAnimationLength === 0) {
                this.swordUp = false;
            }
        } else {
            context.rotate(90 * Math.PI / 180)
            context.fillRect(0, 0, 5, -40)
            context.fillRect(-7, -15, 20, 5)
            context.setTransform(1, 0, 0, 1, 0, 0);
            if (this.tick % this.swordAnimationLength === 0) {
                this.swordUp = true;
            }
        }
        context.restore()
    }

    update(game) {
        this.tick++;
        if (this.action === ACTIONS.moving) {
            let foundEnemy = game.findEnemy(this);
            if (foundEnemy !== null) {
                this.target = foundEnemy;
                this.action = ACTIONS.attacking;
            } else {
                this.position = Math.min(this.position + this.speed, 1330)
            }
        } else if (this.action === ACTIONS.attacking) {
            if (this.tick % this.swordAnimationLength === 0) {
                this.target.health.current -= this.attackDamage;
            }
        }
    }
}