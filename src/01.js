const vm = require('./vm');

const machine = vm({
    inputFile: '01.txt',
    dataTransformer: data => data.split('\n').map(parseFloat),
});

/**
 * Given an array of values, find the values that, when added, produce the
 * given sum.
 * @param {number} sum Sum that numbers should produce
 * @param {array} values Array of potential addends
 * @param {number} numAddends Number of addends to find [default:2]
 * @return {number}
 */
function findAddendsForSum(sum, values, numAddends) {
    let addends = new Set();

    for (let i = 0; i < values.length; i += 1) {
        const addend1 = values[i];
        const addend2 = sum - addend1;

        if (numAddends > 2) {
            Array.from(
                findAddendsForSum(addend2, values, numAddends - 1)
            ).forEach(addend => addends.add(addend));
        } else {
            if (values.includes(addend2)) {
                addends.add(addend1);
                addends.add(addend2);
                break;
            }
        }
    }

    return addends;
}

function multiplySetItems(set) {
    return Array.from(set).reduce((acc, val) => acc * val);
}

// Part 1
const pt1 = findAddendsForSum(2020, machine.data);
const pt1Solution = multiplySetItems(pt1);
console.log(pt1, pt1Solution);

// Part 2
const pt2 = findAddendsForSum(2020, machine.data, 3);
const pt2Solution = multiplySetItems(pt2);
console.log(pt2, pt2Solution);
