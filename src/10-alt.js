const vm = require('./vm');

const sample = `16
10
15
5
1
11
7
19
6
12
4`;

const dataTransformer = data => data.split('\n').map(parseFloat);
// .sort((a, b) => a - b);

const { data } = vm({
    inputFile: '10.txt',
    dataTransformer,
});

const sampleInput = dataTransformer(sample);

function buildAdjacencyMatrix(input) {
    return input.map(a =>
        input.map(b => ([1, 2, 3].includes(b - a) ? b - a : 0))
    );
}

function findNumberOfPaths(input) {
    const values = [...input, 0];
    const matrix = buildAdjacencyMatrix(values);
    console.log(matrix);
    const current = values.indexOf(0);
    const target = values.indexOf(Math.max(...values));
    const reached = { [current]: 1 };

    function traverse(index) {
        if (index === target) {
            return 1;
        }

        const children = matrix[index].map((node, i) => {
            if (node > 0) {
                if (i in reached) {
                    return reached[i];
                }
                return traverse(i);
            }
            return 0;
        });

        const paths = children.reduce((a, b) => a + b, 0);
        reached[index] = paths;

        return paths;
    }

    return traverse(current);
}

const input = sampleInput;
console.log(findNumberOfPaths(input));
