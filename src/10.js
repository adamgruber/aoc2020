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

const dataTransformer = data =>
    data
        .split('\n')
        .map(parseFloat)
        .sort((a, b) => a - b);

const { data } = vm({
    inputFile: '10.txt',
    dataTransformer,
});

const sampleInput = dataTransformer(sample);

const makeAdapterChain = adapters => {
    const diffs = [0, 0, 0, 0];

    for (let i = adapters.length - 1; i >= 0; i -= 1) {
        const diff = adapters[i] - (adapters[i - 1] || 0);
        diffs[diff - 1] += 1;
    }

    return diffs[0] * diffs[2];
};

const pathsToNode = (node, target, tree) => {
    if (node === target) {
        return 0;
    }
    return [node - 1, node - 2, node - 3].filter(n => tree.includes(n)).length;
};

// function dfs(root, val, tree) {
//     let stack = [root];
//     let count = 0;
//     let v = [];
//     let visited = {};

//     while (stack.length) {
//         const node = stack.pop();
//         // console.log(node);
//         const ptn = pathsToNode(node, val, tree);
//         v.push(node);
//         visited[node] = ptn;
//         // if (node === val) {
//         //     continue;
//         // }
//         const ancestors = findPrevNodes(node, tree);
//         // stack.push(...ancestors.filter(a => !v.includes(a)));
//         stack.push(...ancestors);
//     }
//     // console.log(v);
//     console.log(visited);
//     return count;
// }

const findPrevNodes = (node, tree) =>
    [node - 1, node - 2, node - 3].filter(n => tree.includes(n));

function dfs(target, tree) {
    const stack = [target];

    while (stack.length) {
        const node = stack.pop();
        console.log(node);
        const ancestors = findPrevNodes(node, tree);
        stack.push(...ancestors);
    }
}

const input = sampleInput;
const max = Math.max(...input);
const adapters = [0, ...input, max + 3];
dfs(max + 3, adapters);

// const diffs = makeAdapterChain(adapters);
// console.log(diffs[0] * diffs[2]);
// console.log(sampleInput.length);
// countPossibleChains(sampleInput);
