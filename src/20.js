const charm = require('charm')(process);
const vm = require('./vm');

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;

const sideMap = {
    0: 'TOP',
    1: 'RIGHT',
    2: 'BOTTOM',
    3: 'LEFT',
};

/**
 * Get borders for a tile
 *
 * @param {string} tile Raw tile input
 * @return {array} Array of borders in order [top, right, bottom, left]
 */
const getTileBorders = (tile, includeFlipped) => {
    tile = tile.raw.split('\n');
    const size = tile.length;
    const top = tile[0];
    const bot = tile[size - 1];
    const left = tile.map(t => t.charAt(0)).join('');
    const right = tile.map(t => t.charAt(size - 1)).join('');
    let borders = [top, right, bot, left];
    if (includeFlipped) {
        borders = borders.concat(
            borders.map(b => b.split('').reverse().join(''))
        );
    }
    return borders;
};

const stripTileBorders = tile => {
    tile = tile.raw.split('\n');

    // Strip top/bottom borders
    tile.shift();
    tile.pop();

    // Strip first/chars in each line
    tile = tile.map(line => line.substr(1, line.length - 2));
    return tile.join('\n');
};

const dataTransformer = data => {
    return data.split('\n\n').map(t => {
        let tile = t.split('\n');
        const [, id] = tile.shift().match(/Tile (\d+):/);
        return {
            id: parseInt(id, 10),
            edges: [],
            placedEdges: [],
            initial: tile.join('\n').replace(/\./g, '0').replace(/#/g, '1'),
            raw: tile.join('\n').replace(/\./g, '0').replace(/#/g, '1'),
            rotation: 0,
            position: [0, 0],
            isFlipped: false,
        };
    });
};

const { data: input } = vm({
    inputFile: '20.txt',
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
    tile.isFlipped = true;
};

const turnTile = tile => {
    rotateTile(tile);
    if (tile.rotation === 0) {
        flipTile(tile);
    }
};

const setTile = (start, tile) => {
    // Everything relative to start tile position/rotation
    const borders = getTileBorders(start);

    // console.log(tile.raw);

    // Test each side of tile against start sides
    for (let side = 0; side < borders.length; side += 1) {
        if (start.placedEdges[side]) {
            continue;
        }
        const border = borders[side];
        const oppositeSide = (side + 2) % 4;
        let checkedPositions = 0;

        const isMatch = () => {
            const tileBorders = getTileBorders(tile);
            // console.log(side, border, tileBorders[oppositeSide]);
            return border === tileBorders[oppositeSide];
        };

        let match = isMatch();
        while (!match && checkedPositions < 9) {
            turnTile(tile);
            match = isMatch();
            checkedPositions += 1;
        }

        if (match) {
            // console.log('match');
            start.placedEdges[side] = tile;
            tile.placedEdges[oppositeSide] = start;
            setTilePosition(start, tile, side);
            break;
        } else {
            // console.log('reset');
            // reset tile
            tile.raw = tile.initial;
            tile.rotation = 0;
        }
    }
};

const setTilePosition = (start, tile, pos) => {
    const [x, y] = start.position;
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

const findEdges = tiles => {
    tiles.forEach(start => {
        const startBorders = getTileBorders(start);
        for (let i = 0; i < tiles.length; i += 1) {
            const tile = tiles[i];

            if (tile.id === start.id) {
                continue;
            }

            const borders = getTileBorders(tile, true);
            borders.forEach(b => {
                const idx = startBorders.indexOf(b);
                if (idx >= 0) {
                    start.edges.push(tile.id);
                }
            });
        }
    });
};

const getCorners = tiles => tiles.filter(t => t.edges.length === 2);
const getTileById = (tiles, id) => tiles.filter(t => t.id === id)[0];

const makeImage = (tiles, startTile) => {
    const placed = new Set();
    placed.add(startTile.id);
    console.log(
        `${startTile.id} (  0) N [${startTile.position}] is starting tile`
    );

    // Set placement for each tile based on its edges
    const iterateTiles = start => {
        // console.log(`Placing edges: ${start.edges} for ${start.id}`);
        for (let i = 0; i < start.edges.length; i += 1) {
            const tile = getTileById(tiles, start.edges[i]);

            // Skip if tile has already been placed
            if (placed.has(tile.id) || placed.size === 10) {
                continue;
            }

            if (!tile.raw) {
                console.log(tile);
            }

            // Set tile placement/rotation
            setTile(start, tile);

            placed.add(tile.id);

            iterateTiles(tile);
        }
    };

    iterateTiles(startTile);
};

const chunkArray = (arr, size) => {
    const chunked = [];
    let i;
    let j;
    for (i = 0, j = arr.length; i < j; i += size) {
        chunked.push(arr.slice(i, i + size));
    }
    return chunked;
};

const shiftPositions = tiles => {
    let shift = 0;
    tiles.forEach(t => {
        shift = Math.min(shift, t.position[0]);
    });

    shift = Math.abs(shift);

    tiles.forEach(t => {
        const [x, y] = t.position;
        t.position = [x + shift, y + shift];
    });
};

const sortTiles = tiles =>
    tiles.sort((a, b) => {
        const [aX, aY] = a.position;
        const [bX, bY] = b.position;
        if (aY === bY) {
            return aX - bX;
        }
        return bY - aY;
    });
// const sortedTiles = [];
// sorted.forEach(t => {
//     t.final = stripTileBorders(t);
//     sortedTiles.push(t.final);
// });

// let chunked = chunkArray(sortedTiles, Math.sqrt(sorted.length)).map(row => {
//     let merged = '';
//     row.forEach(tile);
// });
// };

const printImage = (tiles, offset = 0, prop = 'raw') => {
    // console.clear();
    tiles.forEach(t => {
        const tileSize = prop === 'raw' ? 10 : 8;
        const [x, y] = t.position;
        const newX = x * tileSize + (x * 1 + 1);
        const newY = Math.abs(y - 2) * tileSize + Math.abs(y - 2);

        // console.log(t.position, [newX, newY]);

        t[prop].split('\n').forEach((line, idx) => {
            charm.position(newX, newY + idx + offset).write(`${line}`);
        });
    });
    charm.down(1).end();
};

findEdges(input);
const corners = getCorners(input);
// console.log(corners);

makeImage(input, corners[0]);
// console.log(input);
//

// const finalImage = makeFinalImage(input);

function debug(tiles) {
    tiles.forEach(t => {
        console.log(t.id, t.rotation, t.position);
        t.edges.forEach((e, s) => {
            console.log(`  ${sideMap[s]}: ${e.id}`);
        });
        console.log();
    });
}

shiftPositions(input);
// const sorted = sortTiles(input);
// console.clear();
debug(input);
// printImage(input, 0);
