const vm = require('./vm');

const isBetween = (num, range) => range[0] <= num && num <= range[1];

const makeValidator = (rangeA, rangeB) => num => {
    // console.log(num, rangeA, rangeB);
    return isBetween(num, rangeA) || isBetween(num, rangeB);
};

const dataTransformer = data => {
    let [rules, ticket, nearby] = data
        .split('\n\n')
        .map(chunk => chunk.split('\n'));

    const ranges = [];
    let errorRate = 0;
    let invalid = [];

    rules = rules.reduce((acc, rule) => {
        const [, key, r1s, r1e, r2s, r2e] = rule.match(
            /^([^:]+):\s(\d+)-(\d+)\sor\s(\d+)-(\d+)$/
        );
        const rA = [r1s, r1e].map(parseFloat);
        const rB = [r2s, r2e].map(parseFloat);
        ranges.push(rA);
        ranges.push(rB);
        return {
            ...acc,
            [key]: makeValidator(rA, rB),
        };
    }, {});

    ticket = ticket[1].split(',').map(parseFloat);

    nearby.shift();
    nearby = nearby.map(t =>
        t.split(',').map(num => {
            num = parseInt(num, 10);
            if (ranges.some(r => !isBetween(num, r))) {
                invalid.push(num);
                errorRate += num;
            }
            return num;
        })
    );

    return { rules, ticket, nearby, errorRate, invalid };
};

const { data: sample } = vm({
    inputFile: '16-sample2.txt',
    dataTransformer,
});

const { data: input } = vm({
    inputFile: '16.txt',
    dataTransformer,
});

const groupTixByIdx = tix => {
    const tixByIdx = [];
    tix.forEach(t => {
        t.forEach((val, idx) => {
            if (!tixByIdx[idx]) {
                tixByIdx[idx] = [val];
            } else {
                tixByIdx[idx].push(val);
            }
        });
    });
    return tixByIdx;
};

const filterNearby = (rules, tix) =>
    tix.filter(t => t.every(val => rules.some(r => r(val))));

const determineFields = (rules, tix) => {
    const tixByIdx = groupTixByIdx(tix);
    let fields = Object.keys(rules);

    const foundIndexes = {};

    while (fields.length) {
        tixByIdx.forEach((vals, i) => {
            const passing = [];
            fields.forEach(f => {
                const rule = rules[f];
                if (vals.every(val => rule(val))) {
                    passing.push(f);
                }
            });
            if (passing.length === 1) {
                foundIndexes[passing[0]] = i;
                fields = fields.filter(fld => fld !== passing[0]);
            }
        });
    }

    return foundIndexes;
};

const n = filterNearby(Object.values(input.rules), input.nearby);
const idxs = determineFields(input.rules, n);
const departureIndexes = Object.entries(idxs)
    .filter(([key]) => key.startsWith('departure'))
    .map(x => x[1]);

const ans = departureIndexes.reduce((acc, idx) => acc * input.ticket[idx], 1);
console.log(ans);
