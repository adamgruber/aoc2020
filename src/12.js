const vm = require('./vm');

const dataTransformer = data =>
    data.split('\n').map(line => {
        const [, action, value] = line.match(/^(\w)(\d+)$/);
        return [action, parseInt(value, 10)];
    });

const { data: input } = vm({
    inputFile: '12.txt',
    dataTransformer,
});

const sample = dataTransformer(`F10
N3
F7
R90
F11`);

const N = 'N';
const S = 'S';
const E = 'E';
const W = 'W';
const L = 'L';
const R = 'R';
const F = 'F';

const turn = (start, degrees) => {
    const dirs = [N, E, S, W];
    const curr = dirs.indexOf(start);
    const next = (curr + degrees / 90) % dirs.length;
    return dirs[next];
};

const move = (pos, direction, value) => {
    switch (direction) {
        case N:
            pos.y -= value;
            break;

        case S:
            pos.y += value;
            break;

        case E:
            pos.x += value;
            break;

        case W:
            pos.x -= value;
            break;
    }
};

const rotate = (origin, point, angle) => {
    const { x: cx, y: cy } = origin;
    const { x, y } = point;
    const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    point.x = cos * (x - cx) - sin * (y - cy) + cx;
    point.y = cos * (y - cy) + sin * (x - cx) + cy;
};

const navA = directions => {
    let facing = E;
    let shipPos = { x: 0, y: 0 };

    directions.forEach(([action, value]) => {
        switch (action) {
            case L:
                facing = turn(facing, 360 - value);
                break;

            case R:
                facing = turn(facing, value);
                break;

            case F:
                move(shipPos, facing, value);

                break;

            default:
                move(shipPos, action, value);
        }
    });

    return shipPos.x + shipPos.y;
};

const navB = directions => {
    let ship = { x: 0, y: 0 };
    let waypoint = { x: 10, y: -1 };

    directions.forEach(([action, value]) => {
        switch (action) {
            case L: {
                rotate(ship, waypoint, 360 - value);
                break;
            }

            case R: {
                // rotate around ship clockwise
                rotate(ship, waypoint, value);
                break;
            }

            case F: {
                // calc E or W
                const h = ship.x > waypoint.x ? W : E;
                const dx = Math.abs(value * (waypoint.x - ship.x));
                // calc N or S
                const v = ship.y < waypoint.y ? S : N;
                const dy = Math.abs(value * (waypoint.y - ship.y));

                move(ship, h, dx);
                move(ship, v, dy);
                move(waypoint, h, dx);
                move(waypoint, v, dy);
                break;
            }

            default:
                move(waypoint, action, value);
        }
    });

    return ship.x + ship.y;
};

console.log(navA(sample));
console.log(navB(sample));

console.log(navA(input));
console.log(navB(input));
