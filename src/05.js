const vm = require('./vm');

const dataTransformer = data => data.split('\n');

const machineA = vm({
    inputFile: '05.txt',
    dataTransformer,
});

const findVal = (pattern, rangeMax) => {
    let rowRange = [0, rangeMax];

    pattern.forEach(char => {
        if (char === 'F' || char === 'L') {
            rowRange[1] = Math.floor((rowRange[1] + rowRange[0]) / 2);
        } else {
            rowRange[0] = Math.ceil((rowRange[1] + rowRange[0]) / 2);
        }
    });
    if (rowRange[0] === rowRange[1]) {
        return rowRange[0];
    }

    console.log('row ranges do not match', rowRange);
    return 'mismatch';
};

const parseBoardingPass = data => {
    const row = findVal(data.slice(0, 7).split(''), 127);
    const col = findVal(data.slice(7).split(''), 7);
    return {
        row,
        col,
        seatId: row * 8 + col,
    };
};

const parsePasses = data => data.map(parseBoardingPass);

const findHighestSeat = data => {
    let highestSeat = 0;
    const parsedPasses = data.map(parseBoardingPass);
    parsedPasses.forEach(({ seatId }) => {
        if (seatId > highestSeat) {
            highestSeat = seatId;
        }
    });
    return highestSeat;
};

const findMissingSeats = passes => {
    const seats = new Set();
    const ids = new Set();
    passes.forEach(({ row, col, seatId }) => {
        seats.add({ row, col });
        ids.add(seatId);
    });

    let missingSeatIds = [];
    for (let r = 1; r < 127; r += 1) {
        for (let c = 0; c <= 7; c += 1) {
            const id = r * 8 + c;
            if (!ids.has(id)) {
                missingSeatIds.push(id);
            }
        }
    }

    console.log(missingSeatIds);

    missingSeatIds.forEach(id => {
        if (ids.has(id - 1) && ids.has(id + 1)) {
            console.log(id);
        }
    });

    return 'ugh';

    // console.log(missingSeats);
};

// [0,0]
// [127,7]

console.log(findMissingSeats(parsePasses(machineA.data)));
// console.log(findHighestSeat(machineA.data));
