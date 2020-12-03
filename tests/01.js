const { run, machine } = require('../src/01');

describe('Part 1', () => {
    it('should return expected product', () => {
        console.log(run(machine.data, 2020));
    });
});

describe('Part 2', () => {
    it('should return expected product', () => {
        console.log(run(machine.data, 2020, 3));
    });
});
