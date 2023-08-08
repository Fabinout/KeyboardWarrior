import {random_word, Word} from "./word";

export class WordUpdater {

    updateWords(game) {
        let aw = game.availableWords.map(w => w.value)
        let as = (game.availableSpells.map(w => w.name));
        let contains = function (element) {
            return aw.indexOf(element) > -1;
        };

        if (contains(game.currentWord)) {
            //*
            let word = aw.find(w => w === game.currentWord);
            game.mana = Math.min(game.currentWord.length + game.mana, 100);
            let position = game.availableWords.find(w => w.value === game.currentWord).position;
            game.wordsToRecreate.push({x: position.x, y: position.y, time: game.ticks});

            let wordFound = false;
            game.availableWords = game.availableWords.filter(w => {
                if (!wordFound) {

                    if (w.value !== game.currentWord && !wordFound) {
                        return true;
                    } else {
                        wordFound = true;
                        return false;
                    }
                } else {
                    return true;
                }
            })
            game.clearWord();

        } else {
            if (as.indexOf(game.currentWord) > -1) {
                let spell = game.availableSpells.find(w => w.name === game.currentWord);
                spell.cast(game);
                game.mana -= spell.cost;
                game.clearWord();
            }
        }
        let self = this;
        let savedForLater = []
        console.log(game.wordsToRecreate)
        console.log(savedForLater)
        for (const word of game.wordsToRecreate) {
            let cooldown = 100;
            if (game.ticks > word.time + cooldown) {
                let value = random_word();
                while (contains(value)) {
                    value = random_word();
                }
                game.availableWords.push(new Word(value, word.x, word.y))
                console.log(game.availableWords)
            } else {
                savedForLater.push(word);
            }
        }
        game.wordsToRecreate = savedForLater;
    }
}