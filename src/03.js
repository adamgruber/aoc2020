const vm = require('./vm');

const TREE = '#';
const dataTransformer = data => data.split('\n');

const machineA = vm({
    inputFile: '03-sample.txt',
    dataTransformer,
});

const machineB = vm({
    inputFile: '03.txt',
    dataTransformer,
});

class Sled {
    constructor(terrain, slopes) {
        this.terrain = terrain;
        this.slopes = slopes;
        this.terrainH = this.terrain.length;
        this.terrainW = this.terrain[0].length;
        this.treesBySlope = {};
        this.position = null;
    }

    move([rise, run]) {
        const [x, y] = this.position;
        this.position = [x + run, y + rise];
    }

    checkPosition() {
        const [x, y] = this.position;
        const line = this.terrain[y % this.terrainH];
        const char = line[x % this.terrainW];
        return char === TREE ? 1 : 0;
    }

    findTreesForSlope(slope) {
        let trees = 0;
        this.position = [0, 0];
        while (this.position[1] < this.terrainH) {
            trees += this.checkPosition();
            this.move(slope);
        }
        return trees;
    }

    run() {
        const answer = this.slopes
            .map(this.findTreesForSlope.bind(this))
            .reduce((acc, n) => acc * n);
        console.log(answer);
    }
}

const slopes = [
    [1, 1],
    [1, 3],
    [1, 5],
    [1, 7],
    [2, 1],
];

const sledA = new Sled(machineA.data, slopes);
sledA.run();

const sledB = new Sled(machineB.data, slopes);
sledB.run();
