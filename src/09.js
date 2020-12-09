const vm = require('./vm');

const sample = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;

const dataTransformer = data => data.split('\n').map(parseFloat);

const { data: input } = vm({
    inputFile: '09.txt',
    dataTransformer,
});

const crackXmas = (cipher, preambleLength) => {
    let start = 0;
    let invalidValue;
    for (let i = preambleLength; i < cipher.length; i += 1) {
        const val = cipher[i];
        const preamble = cipher
            .slice(start, preambleLength + start)
            .sort((a, b) => a - b);
        const minSum = preamble[0] + preamble[1];
        const maxSum =
            preamble[preambleLength - 1] + preamble[preambleLength - 2];
        if (val >= minSum && val <= maxSum) {
            start += 1;
            continue;
        } else {
            invalidValue = val;
            break;
        }
    }
    return invalidValue;
};

const findContiguousAddends = (cipher, sum) => {
    let start = 0;
    let end = 0;
    let contiguousSum = 0;
    while (contiguousSum !== sum) {
        for (let i = start; i < cipher.length; i += 1) {
            contiguousSum += cipher[i];
            if (contiguousSum === sum) {
                end = i + 1;
                break;
            }

            if (contiguousSum > sum) {
                contiguousSum = 0;
                start += 1;
                break;
            }
        }
    }

    return cipher.slice(start, end);
};

const sumMinMaxInRange = range => {
    return Math.min(...range) + Math.max(...range);
};

const sampleInput = dataTransformer(sample);

// Sample
console.log('Sample 1', crackXmas(sampleInput, 5));

// Part 1
const invalidNum = crackXmas(input, 25);
console.log('Part 1 ', invalidNum);

// Part 2
console.log(
    'Part 2 ',
    sumMinMaxInRange(findContiguousAddends(input, invalidNum))
);
