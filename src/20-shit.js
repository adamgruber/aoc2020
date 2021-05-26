const charm = require('charm')(process);
const vm = require('./vm');

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;

const F_TOP = 4;
const F_RIGHT = 5;
const F_BOTTOM = 6;
const F_LEFT = 7;

const sideMap = {
    0: 'TOP',
    1: 'RIGHT',
    2: 'BOTTOM',
    3: 'LEFT',
    4: 'F_TOP',
    5: 'F_RIGHT',
    6: 'F_BOTTOM',
    7: 'F_LEFT',
};

const printTile = tile => {
    console.log(tile.raw.join('\n'));
    console.log();
};

/**
 * Get borders for a tile
 *
 * @param {object} tile Tile to parse
 * @return {array} Array of borders in order [top, right, bottom, left]
 */
const parseTile = tile => {
    if (!Array.isArray(tile)) {
        tile = tile.split('\n');
    }
    const size = tile.length;
    const top = tile[0];
    const bot = tile[size - 1];
    const left = tile.map(t => t.charAt(0)).join('');
    const right = tile.map(t => t.charAt(size - 1)).join('');
    return [top, right, bot, left];
};

const dataTransformer = data => {
    return data.split('\n\n').map(t => {
        let tile = t.split('\n');
        const [, id] = tile.shift().match(/Tile (\d+):/);
        return {
            id: parseInt(id, 10),
            edges: [],
            raw: tile.join('\n'),
            rotation: 0,
            position: [0, 0],
        };
    });
};

const { data: input } = vm({
    inputFile: '20-sample.txt',
    dataTransformer,
});

// Rotate tile 90 degrees
const rotateTile = tile => {
    tile.raw = tile.raw
        .split('\n')
        .reverse()
        .reduce((acc, line) => {
            line.split('').forEach((ch, i) => {
                acc[i] = (acc[i] || '') + ch;
            });
            return acc;
        }, [])
        .join('\n');
    tile.rotation = (tile.rotation + 90) % 360;
};

// Flip tile on Y axis
const flipTile = tile => {
    tile.raw = tile.raw
        .split('\n')
        .map(line => line.split('').reverse().join(''))
        .join('\n');
};

const turnTile = tile => {
    rotateTile(tile);
    if (tile.rotation === 0) {
        flipTile(tile);
    }
};

const solve = tiles => {
    tiles.forEach(tileA => {
        const others = tiles.filter(t => t.id !== tileA.id);
        others.forEach(tileB => {
            [...tileB.borders, ...tileB.flipped].forEach(b => {
                const idx = tileA.borders.indexOf(b);
                if (idx >= 0) {
                    tileA.edges.push({
                        id: tileB.id,
                        border: b,
                    });
                }
            });
        });
    });

    // console.log(tiles);
    const corners = tiles.filter(t => t.edges.length === 2);
    // console.log(corners);
    const cornerIds = corners.map(t => t.id);
    // console.log(cornerIds);
    return cornerIds.reduce((acc, id) => acc * id, 1);
};

const setTile = (start, tile) => {
    // console.log(start.id, tile.id);
    // Everything relative to start tile position/rotation
    const borders = parseTile(start.raw);

    // Test each side of tile against start sides
    for (let side = 0; side < borders.length; side += 1) {
        if (start.edges[side]) {
            continue;
        }
        const border = borders[side];
        // console.log(border);
        const oppositeSide = (side + 2) % 4;
        let checkedPositions = 0;

        const isMatch = () => {
            const tileBorders = parseTile(tile.raw);
            // console.log(border, tileBorders[oppositeSide], tile.rotation);
            return border === tileBorders[oppositeSide];
        };

        while (checkedPositions <= 8 && !isMatch()) {
            turnTile(tile);
            checkedPositions += 1;
        }

        if (isMatch()) {
            // printTile(tile);
            // console.log(side, oppositeSide, tile.rotation);
            start.edges[side] = tile.id;
            setTilePosition(start, tile, side);
            const rot = `${tile.rotation}`.padStart(3, ' ');
            console.log(
                `${tile.id} (${rot}) [${tile.position}] matches ${sideMap[side]} of ${start.id}`
            );
        }
    }
};

// const setTileFinal = (tile, rotation, flip) => {
//     tile.rotation = rotation;
//     switch (rotation) {
//         case 90:
//             tile.final = tile.raw
//                 .split('\n')
//                 .reverse()
//                 .reduce((acc, line) => {
//                     line.split('').forEach((ch, i) => {
//                         acc[i] = (acc[i] || '') + ch;
//                     });
//                     return acc;
//                 }, [])
//                 .join('\n');
//             break;

//         case 180:
//             tile.final = tile.raw
//                 .split('\n')
//                 .reverse()
//                 .map(l => l.split('').reverse().join(''))
//                 .join('\n');
//             break;

//         case 270:
//             tile.final = tile.raw
//                 .split('\n')
//                 .reverse()
//                 .map(l => l.split('').reverse().join(''))
//                 .reverse()
//                 .reduce((acc, line) => {
//                     line.split('').forEach((ch, i) => {
//                         acc[i] = (acc[i] || '') + ch;
//                     });
//                     return acc;
//                 }, [])
//                 .join('\n');
//             break;

//         default:
//             tile.final = tile.raw;
//     }

//     switch (flip) {
//         case 'x':
//             tile.final = tile.final.split('\n').reverse().join('\n');
//             break;

//         case 'y':
//             tile.final = tile.final
//                 .split('\n')
//                 .map(line => line.split('').reverse().join(''))
//                 .join('\n');
//             break;

//         case 'xy':
//             tile.final = tile.final
//                 .split('\n')
//                 .reverse()
//                 .map(line => line.split('').reverse().join(''))
//                 .join('\n');
//             break;

//         default:
//         // skip
//     }
// };

const getTileById = (tiles, id) => tiles.filter(t => t.id === id)[0];

const setTilePosition = (start, tile, pos) => {
    // console.log(pos);
    const [x, y] = start.position;
    // const rot = [0, 90, 180, 270];
    // pos = (pos + rot.indexOf(tile.rotation)) % 4;
    switch (pos) {
        case TOP:
            tile.position = [x, y + 1];
            break;

        case RIGHT:
            tile.position = [x + 1, y];
            break;

        case BOTTOM:
            tile.position = [x, y - 1];
            break;

        case LEFT:
            tile.position = [x - 1, y];
            break;
    }
};

// const setTileX = (start, tile) => {
//     const shiftSide = () => {
//         switch (start.rotation) {
//             case 90:
//                 side = (side + 1) % 4;
//                 break;

//             case 180:
//                 side = (side + 2) % 4;
//                 break;

//             case 270:
//                 side = (side + 3) % 4;
//                 break;

//             default:
//             // Nothing
//         }
//     };

//     // Which side is the matching edge
//     let side = [...start.borders, ...start.flipped].indexOf(border);

//     // account for rotation
//     shiftSide();

//     // Set the orientation
//     // which of the tile's borders is the match?
//     const borderMatch = [...tile.borders, ...tile.flipped].indexOf(border);
//     const absPosition = Math.abs(side - borderMatch);

//     const rotationMap = {
//         // 0: 180,
//         1: 90,
//         2: 0,
//         3: 270,
//         4: 180,
//         // 5: 90,
//         // 6: 180,
//         // 7: 270,
//     };

//     const rotation = rotationMap[absPosition] || 0;

//     console.log(
//         tile.id,
//         `${sideMap[side]} (${side})`,
//         start.id,
//         `${sideMap[borderMatch]} (${borderMatch})`,
//         rotation,
//         absPosition
//     );

//     let flip = null;

//     if (borderMatch === 6) {
//         flip = 'y';
//     }

//     // setTileFinal(tile, rotation, flip);

//     // Set tile position
//     setTilePosition(start, tile, side);
// };

const makeImage = tiles => {
    // Grab a tile as our starting point and assume it is right side up
    // const startingTile = tiles.filter(
    //     t => t.edges.filter(Boolean).length === 2
    // )[0];
    const startingTile = tiles[0];

    // console.log(startingTile.id);

    const placed = new Set();
    placed.add(startingTile.id);

    // Set placement for each tile based on its edges
    const iterateTiles = start => {
        for (let i = 0; i < tiles.length; i += 1) {
            const tile = tiles[i];

            // Skip if tile has already been placed
            if (tile.id === start.id || placed.has(tile.id)) {
                continue;
            }

            // Set tile placement/rotation
            setTile(start, tile);

            placed.add(tile.id);

            iterateTiles(tile);
        }
    };

    iterateTiles(startingTile);
};

const printImage = (tiles, offset = 0) => {
    // console.clear();
    tiles.forEach(t => {
        const tileSize = 10;
        const [x, y] = t.position;
        const newX = x * tileSize + (x * 1 + 1);
        const newY = Math.abs(y - 2) * tileSize + Math.abs(y - 2);

        // console.log(t.id, [x, y], [newX, newY]);

        // move('toPos', { row: newX, col: newY });
        // console.log(t.id);

        // charm.position(newX, newY).write(`${t.id}`);

        t.final.split('\n').forEach((line, idx) => {
            charm.position(newX, newY + idx + offset).write(`${line}`);
        });
        // console.log(t.final);
    });
    charm.down(1).end();
};

// solve(input);
const sample = [input[0], input[1]];
makeImage(sample);
// printImage(input, 14);
//
//
const testTile = {
    raw: ['123', '456', '789'],
    rotation: 0,
};

// printTile(testTile);
// flipTile(testTile);
// console.log();
// printTile(testTile);

console.log(sample);
