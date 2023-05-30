class KeyboardListener {

    constructor(game) {
        window.onkeydown = function (ev) {
            let key = ev.key;
            if (key.length === 1 && ((key.toLowerCase() !== key.toUpperCase())) || key === "-") {
                game.currentWord += ev.key;
            } else {
                if (key === "Backspace") {
                    console.log("buffer is deleted");
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
            console.log(x)
            console.log(this.position.x)
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

class Soldier {

    constructor() {
        this.position = 0;
        this.size = 1;
        this.speed = 2;
        this.life = 50;
        this.action = ACTIONS.moving;
        this.swordUp = true;
    }

    draw = function (context) {

        context.fillRect(this.position + 100, 550, 20, 40)

        let center = {x: this.position + 100, y: 550}

        context.beginPath();
        context.fillStyle = "bisque"; // #ffe4c4
        context.arc(center.x + 10, center.y - 5, 8, 0, Math.PI * 2, true); // draw circle for head
        // (x,y) center, radius, start angle, end angle, anticlockwise
        context.fill();
        context.beginPath()
        context.lineWidth = 4;
        context.fillStyle = "black";

        let swordStart = {x: center.x + 25, y: center.y + 10}
        let swordSize = {w: 10, h: 20}
        if(this.swordUp){

        context.moveTo(swordStart.x, swordStart.y)
        context.lineTo(swordStart.x + swordSize.h, center.y - swordSize.h)
        context.moveTo(swordStart.x , swordStart.y-15)
        context.lineTo(swordStart.x + swordSize.h-6, center.y +5)
        context.stroke();
        }


    }
    update = function (game) {
        if (this.action === ACTIONS.moving) {
            this.position = Math.min(this.position+ this.speed, 1350)
        } else if (this.action === ACTIONS.attacking) {

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
        this.allied = [new Soldier()];
        this.mana = 0;
        this.world = {x0:100, xs:this.size.w-100}
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
            //console.log("word " + i + "/ colonne:" + colonne + ";rang:" + rang + "; x:" + x + ";y:" + y)
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

            let position = this.availableWords.find(w=> w.value === this.currentWord).position;
            this.wordsToRecreate.push({x: position.x, y: position.y, time: this.ticks})
            this.availableWords = this.availableWords.filter(w => w.value !== this.currentWord)
            this.clearWord();
        }else{
            if (as.indexOf(this.currentWord)>-1){
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
                this.availableWords.push(new Word(random_word(), word.x, word.y))
            } else {
                savedForLater.push(word);
            }
        }
        this.wordsToRecreate = savedForLater;
    }

    draw = function (ctx, canvasSize) {
        ctx.clearRect(0, 0, canvasSize.w, canvasSize.h)
        //console.log(this.availableWords.length)
        for (const w of this.availableWords) {
            w.draw(ctx, this.currentWord);
        }
        this.drawManaBar(ctx, canvasSize, this.mana, this.availableSpells);
        this.drawBuffer();
        //ctx.fillRect(200,200,200,200)
        this.allied.forEach(b => b.draw(ctx));
    }

    drawManaBar(ctx, canvasSize, mana, spells) {

        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "black";
        let manaBarHeight = 500;
        let manaBarWidth = 30;

        ctx.rect(10, 580, manaBarWidth, -manaBarHeight);
        ctx.stroke();

        // console.log("mana :" + (mana) / 100)
        ctx.save()
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.fillStyle = "blue";
        ctx.fillRect(10, 580, manaBarWidth, -manaBarHeight * (mana) / 100);
        ctx.stroke();
        ctx.restore()

        ctx.font = "15px Courier New";
        ctx.fillText("Mana", 10, manaBarWidth);
        ctx.fillText(mana + "/100", 10, 50);

        function drawSpells() {
            let cw = this.currentWord;
            spells.forEach(w => {
                    let y = 580 - (500 * w.cost / 100)
                    ctx.fillText("- " + w.name, manaBarWidth + 10, y)
                }
            )
        }

        drawSpells();
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

