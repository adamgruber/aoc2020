const vm = require('./vm');

const dataTransformer = data => data.split('\n\n');

const { data: input } = vm({
    inputFile: '06.txt',
    dataTransformer,
});

const countForGroup = data => {
    const y = new Set(data.replace(/\n/g, '').split(''));
    return Array.from(y).filter(ans =>
        data.split('\n').every(a => a.includes(ans))
    ).length;
};

const countYs = data =>
    data.reduce((acc, group) => acc + countForGroup(group), 0);

console.log(countYs(input));
