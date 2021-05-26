const vm = require('./vm');

const dataTransformer = data => data;

const { data: input } = vm({
    inputFile: '00.txt',
    dataTransformer,
});
