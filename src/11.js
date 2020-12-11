const vm = require('./vm');

const dataTransformer = data => data;

const { data: input } = vm({
    inputFile: '11.txt',
    dataTransformer,
});

const FLOOR = '.';
const EMPTY = 'L';
const FILLED = '#';

const movers = {
    U: ([x, y]) => [x, y - 1],
    UR: ([x, y]) => [x + 1, y - 1],
    R: ([x, y]) => [x + 1, y],
    RD: ([x, y]) => [x + 1, y + 1],
    D: ([x, y]) => [x, y + 1],
    LD: ([x, y]) => [x - 1, y + 1],
    L: ([x, y]) => [x - 1, y],
    UL: ([x, y]) => [x - 1, y - 1],
};

const dirs = Object.keys(movers);

const getSeatAtPos = ([x, y], seats) => {
    return (seats[y] || [])[x];
};

const getAdjacentOccupiedSeats = (seatPos, seats) =>
    dirs.reduce((acc, dir) => {
        const adjacentSeat = getSeatAtPos(movers[dir](seatPos), seats);
        return acc + (adjacentSeat === FILLED ? 1 : 0);
    }, 0);

const getOccupiedSeatsInView = (seatPos, seats) =>
    dirs.reduce((acc, dir) => {
        const firstSeat = getFirstSeatInViewForDirection(seatPos, seats, dir);
        return acc + (firstSeat === FILLED ? 1 : 0);
    }, 0);

const getFirstSeatInViewForDirection = (seatPos, seats, direction) => {
    const moveFn = movers[direction];
    let nextPos = moveFn(seatPos);
    let seatAtNextPos = getSeatAtPos(nextPos, seats);
    while (seatAtNextPos === FLOOR) {
        nextPos = moveFn(nextPos);
        seatAtNextPos = getSeatAtPos(nextPos, seats);
    }
    return seatAtNextPos;
};

const processSeat = (seat, adjOccupied, maxOccupied) => {
    switch (seat) {
        case EMPTY:
            return adjOccupied ? EMPTY : FILLED;

        case FILLED:
            return adjOccupied >= maxOccupied ? EMPTY : FILLED;

        default:
            return seat;
    }
};

const model = (data, searchFn, maxOccupied) => {
    const graph = data.split('\n').map(line => line.split(''));
    const next = [];
    for (let i = 0; i < graph.length; i += 1) {
        if (!next[i]) {
            next[i] = [];
        }
        for (let j = 0; j < graph[0].length; j += 1) {
            const seatPos = [j, i];
            const seat = graph[i][j];
            if (seat === FLOOR) {
                next[i][j] = seat;
            } else {
                // find adjacent occupied seats
                const occupied = searchFn(seatPos, graph);
                // determine next seat state
                const nextSeat = processSeat(seat, occupied, maxOccupied);
                next[i][j] = nextSeat;
            }
        }
    }

    const out = next.map(row => row.join('')).join('\n');
    return out;
};

const getSeatsAfterStablized = (data, ...args) => {
    let next = model(data, ...args);
    while (data !== next) {
        data = next;
        next = model(next, ...args);
    }
    return next.replace(/[^#]/g, '').length;
};

console.log(getSeatsAfterStablized(input, getAdjacentOccupiedSeats, 4));
console.log(getSeatsAfterStablized(input, getOccupiedSeatsInView, 5));
