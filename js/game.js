import {KeyboardListener} from "./keyboardListener";
import {random_word, Word} from "./word";
import {Soldier} from "./unity/soldier";
import {SoldierSpell} from "./spells/soldierSpell";
import {StrongerSpell} from "./spells/strongerSpell";
import {FasterSpell} from "./spells/fasterSpell";
import {WordUpdater} from "./wordUpdater";


export const ACTIONS = {
    moving: Symbol("moving"),
    attacking: Symbol("attacking")
}

export const SIDE = {
    ally: Symbol("ally"),
    enemy: Symbol("enemy")
}


class Game {

    constructor() {
        this.self = this;
        this.currentWord = "";
        this.wordsToRecreate = [];
        let k = new KeyboardListener(this);
        this.size = {w: 1600, h: 600}
        this.availableWords = this.generateInitialWords(this.size);
        this.availableSpells = [new SoldierSpell(), new StrongerSpell(), new FasterSpell()]
        this.wordUpdater = new WordUpdater();
        this.allied = [new Soldier(SIDE.ally)];
        this.mana = 0;
        this.health = {max: 100, current: undefined}
        this.health.current = this.health.max
        this.world = {x0: 100, xs: this.size.w - 100}

        function generateSimpleOpponent() {
            return {health: {current: 100, max: 100}, mana: 0};
        }

        this.opponent = generateSimpleOpponent()
        this.ennemies = [this.opponent];

        this.ticks = 0;
        let self = this;
        let tick = function () {
            self.ticks++;
            let ctx = document.getElementById("screen").getContext("2d");
            self.update();
            self.draw(ctx, self.size);
            requestAnimationFrame(tick);
        }
        tick();
    }

    generateInitialWords(size) {
        let initialWords = []
        for (let i = 0; i < 8; i++) {
            let colonne = i % 4
            let rang = i < 4 ? 0 : 1;
            let x = (size.w / 5) * (colonne) + 300;

            let y = (size.h / 2) * rang + 80;

            initialWords.push(new Word(random_word(), x, y));
        }
        return initialWords
    }

    update() {
        let game = this;
        this.wordUpdater.updateWords(game);
        this.allied.forEach(b => b.update(game));

    }

    updateWords() {
    }

    findEnemy(unity) {
        return null;
    }

    draw(ctx, canvasSize) {
        ctx.clearRect(0, 0, canvasSize.w, canvasSize.h)
        //console.log(this.availableWords.length)
        for (const w of this.availableWords) {
            w.draw(ctx, this.currentWord);
        }
        this.drawManaBar(ctx, canvasSize, this.mana, this.availableSpells);
        this.drawMyHealthBar(ctx, canvasSize, this.health);
        this.drawOpponentHealthBar(ctx, canvasSize, this.opponent.health);
        this.drawBuffer();
        //ctx.fillRect(200,200,200,200)
        this.allied.forEach(b => b.draw(ctx));
    }

    drawManaBar(ctx, canvasSize, mana, spells) {
        ctx.save()
        ctx.lineWidth = "4";
        //ctx.strokeStyle = "black";
        let manaBarHeight = 500;
        let manaBarWidth = 50;

        ctx.translate(70, 580)

        ctx.rect(0, 0, manaBarWidth, -manaBarHeight);
        ctx.stroke()

        // console.log("mana :" + (mana) / 100)
        ctx.lineWidth = "4";
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, manaBarWidth, -manaBarHeight * (mana) / 100);

        ctx.font = "30px Courier New";
        ctx.fillText("💧", 15, -manaBarHeight - 40);
        ctx.font = "15px Courier New";
        ctx.fillText(mana + "/100", 5, -manaBarHeight - 20);
        ctx.stroke()


        let self = this

        function drawSpells() {
            let cw = self.currentWord;
            ctx.fillStyle = "black"
            ctx.font = "15px Courier New";
            spells.forEach(w => {
                    let y = 0 - (500 * w.cost / 100)
                    let x = manaBarWidth + 10;
                    if (w.casted) {
                        ctx.fillStyle = "#D3D3D3"
                        ctx.fillText("- " + w.name, x, y)
                        ctx.fillStyle = "black"
                    } else {
                        if (cw.length > 0 && w.name.startsWith(cw)) {
                            ctx.fillStyle = "red"
                            let firstText = "- " + cw;
                            ctx.fillText(firstText, x, y)
                            let wordWidth = ctx.measureText(firstText).width
                            ctx.fillStyle = "black"
                            ctx.fillText(w.name.substring(cw.length), wordWidth + x, y);

                        } else {
                            ctx.fillText("- " + w.name, x, y)
                        }
                    }
                    ctx.stroke()
                }
            )
        }

        drawSpells();
        ctx.restore()
    }

    drawMyHealthBar(ctx, canvasSize, health) {
        ctx.save()
        let maxHealth = health.max;
        ctx.lineWidth = "4";
        //ctx.strokeStyle = "black";
        let healthBarHeight = 500;
        let healthBarWidth = 50;

        ctx.translate(10, 580)

        ctx.rect(0, 0, healthBarWidth, -healthBarHeight);
        ctx.stroke()

        // console.log("mana :" + (mana) / 100)
        ctx.lineWidth = "4";
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, healthBarWidth, -healthBarHeight * (health.current) / maxHealth);

        ctx.font = "35px Courier New";
        ctx.fillText("💕", 5, -healthBarHeight - 40);
        ctx.font = "15px Courier New";
        ctx.fillText(health.current + "/" + maxHealth, 0 - 5, -healthBarHeight - 20);
        ctx.stroke()
        ctx.restore()

    }

    drawOpponentHealthBar(ctx, canvasSize, health) {
        ctx.save()
        let maxHealth = health.max;
        ctx.lineWidth = "4";
        //ctx.strokeStyle = "black";
        let healthBarHeight = 500;
        let healthBarWidth = 50;

        ctx.translate(canvasSize.w - 80, 580)

        ctx.rect(0, 0, healthBarWidth, -healthBarHeight);
        ctx.stroke()

        // console.log("mana :" + (mana) / 100)
        ctx.lineWidth = "4";
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, healthBarWidth, -healthBarHeight * (health.current) / maxHealth);

        ctx.font = "35px Courier New";
        ctx.fillText("💕", 5, -healthBarHeight - 40);
        ctx.font = "15px Courier New";
        ctx.fillText(health.current + "/" + maxHealth, 0 - 5, -healthBarHeight - 20);
        ctx.stroke()
        ctx.restore()
    }

    drawBuffer() {
        let p = document.getElementById("buffer");
        p.innerHTML = this.currentWord;
    }

    clearWord() {
        this.currentWord = "";
    }

    add(unity) {

        let buffSpells = this.availableSpells.filter(s => s.isBuff && s.casted)
        let buffedUnity = unity;
        for (let spell of buffSpells) {
            buffedUnity = spell.buff(buffedUnity);
            spell.casted = false;
        }

        this.allied.push(unity)
    }
}

window.onload = new function () {
    new Game();
}

