const vm = require('./vm');

const dataTransformer = data => data;

const sample = dataTransformer(`.#.
..#
###`);

const { data: input } = vm({
    inputFile: '17.txt',
    dataTransformer,
});

const ACTIVE = '#';
const INACTIVE = '.';

console.log(sample);
