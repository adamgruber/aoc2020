const sample = [0, 3, 6];
const input = [16, 11, 15, 0, 1, 7];

const playGame = (startNums, stopTurn) => {
    const game = new Map();
    let turn = 1;

    const speak = num => {
        const prevNum = (game.get(num) || [])[0];
        if (prevNum === undefined) {
            game.set(num, [turn]);
        } else {
            game.set(num, [turn, prevNum]);
        }
        game.set('last', num);
    };

    while (turn <= stopTurn) {
        if (turn < startNums.length + 1) {
            speak(startNums[turn - 1]);
        } else {
            const last = game.get('last');
            if (game.get(last).length === 1) {
                speak(0);
            } else {
                const [a, b] = game.get(last);
                speak(a - b);
            }
        }
        turn += 1;
    }

    return game.get('last');
};

console.log(playGame(input, 30000000));
// playGame(input, 2020);
