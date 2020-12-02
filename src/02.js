const vm = require('./vm');

const inputRegex = /(\d+)-(\d+)\s(\w):\s(\w+)/;

const dataTransformer = data =>
    data.split('\n').map(line => {
        const match = inputRegex.exec(line);
        return {
            min: parseFloat(match[1]),
            max: parseFloat(match[2]),
            testChar: match[3],
            testStr: match[4],
        };
    });

const machine = vm({
    inputFile: 'day2.txt',
    dataTransformer,
});

const testInput = dataTransformer(`1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`);

const sledRentalValidator = ({ min, max, testChar, testStr }) => {
    // const validator = new RegExp(`${testChar}{${min},${max}}`);
    // return validator.test(testStr);
    const re = new RegExp(`[^${testChar}]`, 'g');
    const trimmed = testStr.replace(re, '');
    return trimmed.length >= min && trimmed.length <= max;
};

const tobogganValidator = ({ min, max, testChar, testStr }) => {
    const posAChar = testStr.charAt(min - 1);
    const posBChar = testStr.charAt(max - 1);

    return posAChar === testChar
        ? posBChar !== testChar
        : posBChar === testChar;
};

const countValidPasswords = (arr, validator) => {
    const validPasswords = arr.filter(validator);
    return validPasswords.length;
};

// Part 1
console.log(countValidPasswords(testInput, sledRentalValidator));
console.log(countValidPasswords(machine.data, sledRentalValidator));

// Part 2
console.log(countValidPasswords(testInput, tobogganValidator));
console.log(countValidPasswords(machine.data, tobogganValidator));
