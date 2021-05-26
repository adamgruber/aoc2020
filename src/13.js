const vm = require('./vm');

const dataTransformer = data => data;

const { data: input } = vm({
    inputFile: '13.txt',
    dataTransformer,
});
