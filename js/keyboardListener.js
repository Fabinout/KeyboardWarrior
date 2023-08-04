export class KeyboardListener {

    constructor(game) {
        window.onkeydown = function (ev) {
            let key = ev.key;
            if (key.length === 1 && ((key.toLowerCase() !== key.toUpperCase())) || key === "-") {
                game.currentWord += ev.key;
            } else {
                if (key === "Backspace") {
                    game.clearWord();
                }
            }
        }
    }
}