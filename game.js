let side
class KeyboardListener {

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

class Word {
    constructor(value, x, y) {
        this.value = value;
        this.position = {x: x, y: y}
    }

    draw = function (ctx, currentBuffer) {
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

Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};

let english_words = ["drawer",
    "hose",
    "smoke",
    "apologise",
    "reminiscent",
    "spicy",
    "color",
    "replace",
    "boring",
    "steam",
    "enormous",
    "industrious",
    "fit",
    "healthy",
    "separate",
    "expect",
    "sleet",
    "crawl",
    "ground",
    "gaping",
    "thoughtless",
    "idiotic",
    "spiky",
    "wistful",
    "cabbage",
    "turn",
    "freezing",
    "natural",
    "heartbreaking",
    "unite",
    "delicious",
    "tree",
    "waiting",
    "cheerful",
    "shivering",
    "crown",
    "glib",
    "follow",
    "embarrass",
    "deafening",
    "like",
    "afford",
    "unique",
    "bushes",
    "guttural",
    "yak",
    "tire",
    "womanly",
    "adjustment",
    "daffy",
    "history",
    "event",
    "limit",
    "ossified",
    "library",
    "general",
    "steer",
    "correct",
    "exchange",
    "white",
    "acceptable",
    "sidewalk",
    "loving",
    "bath",
    "meat",
    "receptive",
    "rough",
    "believe",
    "weather",
    "guitar",
    "cheese",
    "bored",
    "slimy",
    "arrest",
    "punishment",
    "ring",
    "nutritious",
    "scratch",
    "rice",
    "slave",
    "work",
    "high-pitched",
    "faithful",
    "purring",
    "dog",
    "overrated",
    "overconfident",
    "obnoxious",
    "plants",
    "quack",
    "dead",
    "sponge",
    "pleasant",
    "encourage",
    "warm",
    "ordinary",
    "immense",
    "nut",
    "chunky",
    "festive"]
let random_word = function () {
    return english_words[Math.floor(Math.random() * english_words.length)];
}

class SoldierSpell {
    constructor() {
        this.name = "soldier";
        this.cost = 30;
    }

    cast = function (game) {
        console.log("soldier spell is casted")
        game.add(new Soldier());
    }
}


const ACTIONS = {
    moving: Symbol("moving"),
    attacking: Symbol("attacking")
}

const SIDE = {
    ally: Symbol("ally"),
    enemy: Symbol("enemy")
}

class Unity {

    constructor(maxHealth, side) {
        this.health = {current:maxHealth, max: maxHealth}
        this.side = side;
    }
}

class Soldier extends Unity {

    constructor(side) {
        super(50, side);
        this.position = 0;
        this.size = 1;
        this.speed = 2;
        this.health = {current:50, max:50}
        this.action = ACTIONS.moving;
        this.swordUp = true;
        this.tick = 0
        this.swordAnimationLength = 32;
        this.attackDamage = 3;
    }

    draw = function (context) {
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
                this.tick = 0;
            }
        }

        context.restore()

    }
    update = function (game) {
        console.log(this.action)
        this.tick++;


        if (this.action === ACTIONS.moving) {
            let foundEnemy = game.findEnemy(this);
            if(foundEnemy!== null){
                this.target = foundEnemy;
                this.action = ACTIONS.attacking;
            }else{
                this.position = Math.min(this.position + this.speed, 1330)
            }
        } else if (this.action === ACTIONS.attacking) {
            if (this.tick % this.swordAnimationLength === 0) {
                this.target.health.current -= this.attackDamage;
            }

        }
    }
}


class Game {

    self = this;

    constructor() {
        this.currentWord = "";
        this.wordsToRecreate = [];
        let k = new KeyboardListener(this);
        this.size = {w: 1600, h: 600}
        this.availableWords = this.generateInitialWords(this.size);
        this.availableSpells = [new SoldierSpell()]
        this.allied = [new Soldier(SIDE.ally)];
        this.mana = 0;
        this.health = {max: 100, current: undefined}
        this.health.current = this.health.max
        this.world = {x0: 100, xs: this.size.w - 100}
        function generateSimpleOpponent() {
            return {health: {current: 100, max: 100}, mana:0};
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

    update = function () {
        let game = this;
        this.updateWords();
        this.allied.forEach(b => b.update(game));

    }

    updateWords() {
        let aw = this.availableWords.map(w => w.value)
        let as = (this.availableSpells.map(w => w.name));
        let contains = function (element) {
            return aw.indexOf(element) > -1;
        };
        if (contains(this.currentWord)) {
            let word = aw.find(w => w === this.currentWord);
            this.mana = Math.min(this.currentWord.length + this.mana, 100);

            let position = this.availableWords.find(w => w.value === this.currentWord).position;
            this.wordsToRecreate.push({x: position.x, y: position.y, time: this.ticks})
            this.availableWords = this.availableWords.filter(w => w.value !== this.currentWord)
            this.clearWord();
        } else {
            if (as.indexOf(this.currentWord) > -1) {
                let spell = this.availableSpells.find(w => w.name === this.currentWord);
                spell.cast(this);
                this.mana -= spell.cost;
                this.clearWord();
            }
        }
        let self = this;
        let savedForLater = []
        for (const word of this.wordsToRecreate) {
            let cooldown = 100;
            if (self.ticks > word.time + cooldown) {
                let value = random_word();
                while(contains(value)){
                    value = random_word();
                }
                this.availableWords.push(new Word(value, word.x, word.y))
            } else {
                savedForLater.push(word);
            }
        }
        this.wordsToRecreate = savedForLater;
    }

    findEnemy(unity){
        return null;
    }
    draw = function (ctx, canvasSize) {
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

    clearWord = function () {
        this.currentWord = "";
    }
    add = function (unity) {
        this.allied.push(unity)
    }
}

window.onload = new function () {
    new Game();
}

