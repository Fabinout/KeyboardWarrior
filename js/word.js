import {english_words} from "./english_words";

export class Word {
    constructor(value, x, y) {
        this.value = value;
        this.position = {x: x, y: y}
    }

    draw(ctx, currentBuffer) {
        if (currentBuffer.length > 1 && this.value.startsWith(currentBuffer)) {
            ctx.font = "20px Arial";
            ctx.fillStyle = "red"
            ctx.fillText(currentBuffer, this.position.x, this.position.y);
            let x = ctx.measureText(currentBuffer).width
            ctx.fillStyle = "black"
            ctx.fillText(this.value.substring(currentBuffer.length), x + this.position.x, this.position.y);
        } else {
            ctx.font = "20px Arial";
            ctx.fillStyle = "black"
            ctx.fillText(this.value, this.position.x, this.position.y);
        }
    }
}

export let random_word = function () {
    return english_words[Math.floor(Math.random() * english_words.length)];
}