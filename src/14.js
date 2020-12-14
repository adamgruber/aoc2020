const vm = require('./vm');

const dataTransformer = data => data.split('\n');

const sample = dataTransformer(`mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`);

const sample2 = dataTransformer(`mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`);

const sample3 = dataTransformer(`mask = 100110X100000XX0X100X1100110X001X100
mem[21836] = 68949
mem[61020] = 7017251`);

const { data: input } = vm({
    inputFile: '14.txt',
    dataTransformer,
});

const cartesian = (...args) => {
    const res = [];
    const max = args.length - 1;

    function helper(arr = [], i = 0) {
        for (var j = 0, l = args[i].length; j < l; j++) {
            const a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i === max) {
                res.push(a);
            } else {
                helper(a, i + 1);
            }
        }
    }
    helper();
    return res;
};

const getMaskedValue = (value, mask) => {
    // convert value to binary string
    value = parseInt(value, 10).toString(2).padStart(36, '0').split('');

    // pass thru mask
    for (let i = 0; i < value.length; i += 1) {
        const maskChar = mask[i];
        if (maskChar === '0') {
            value[i] = '0';
        }
        if (maskChar === '1') {
            value[i] = '1';
        }
    }

    // return new value
    return parseInt(value.join(''), 2);
};

const runProgram = data => {
    let mask = Array(36).fill('X').join('');
    const mem = [];

    for (let i = 0; i < data.length; i += 1) {
        const cmd = data[i];
        const [, newMask] = cmd.match(/^mask = ([X|0|1]{36})$/) || [];
        if (newMask) {
            mask = newMask;
            continue;
        }

        const [, address, value] = cmd.match(/^mem\[(\d+)\] = (\d+)$/) || [];

        // console.log(value);
        const newValue = getMaskedValue(value, mask);
        mem[parseInt(address, 10)] = newValue;
    }

    return mem.reduce((acc, val) => acc + (val || 0));
};

const getMaskedAddresses = (value, mask) => {
    const addresses = [];
    // convert value to binary string
    value = parseInt(value, 10).toString(2).padStart(36, '0').split('');

    let floatingCount = 0;

    // pass thru mask
    for (let i = 0; i < value.length; i += 1) {
        const maskChar = mask[i];
        if (maskChar === '1') {
            value[i] = '1';
        }
        if (maskChar === 'X') {
            floatingCount += 1;
            value[i] = 'X';
        }
    }

    const variations = cartesian(...Array(floatingCount).fill(['0', '1']));
    const floatStr = value.join('');
    const floats = [...floatStr.matchAll(/([X])/g)];

    variations.forEach(v => {
        let newValue = value.slice(0);
        floats.forEach((a, i) => {
            // console.log(value, v, a.index, i);
            newValue[a.index] = v[i];
        });
        addresses.push(newValue.join(''));
    });

    // return new value
    return addresses.map(a => parseInt(a, 2));
};

const runProgram2 = data => {
    let mask = Array(36).fill('X').join('');
    const mem = {};

    for (let i = 0; i < data.length; i += 1) {
        const cmd = data[i];
        const [, newMask] = cmd.match(/^mask = ([X|0|1]{36})$/) || [];
        if (newMask) {
            mask = newMask;
            continue;
        }

        const [, address, value] = cmd.match(/^mem\[(\d+)\] = (\d+)$/) || [];

        // console.log(value);
        const addresses = getMaskedAddresses(address, mask);
        // console.log(addresses);
        addresses.forEach(a => {
            mem[a] = parseInt(value, 10);
        });
    }

    console.log(Object.keys(mem).length);

    return Object.keys(mem).reduce((acc, key) => acc + mem[key], 0);
};

// console.log(runProgram(sample));
// console.log(runProgram(input));

// console.log(runProgram2(sample3));
console.log(runProgram2(input));
