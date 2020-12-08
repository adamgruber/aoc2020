const vm = require('./vm');

const requiredFields = {
    byr: val => val.length === 4 && val >= 1920 && val <= 2002,
    iyr: val => val.length === 4 && val >= 2010 && val <= 2020,
    eyr: val => val.length === 4 && val >= 2020 && val <= 2030,
    hgt: val => {
        const [_, num, units] = val.match(/(^\d+)(cm|in)$/) || [];
        if (!_) {
            return false;
        }
        const parsedNum = parseInt(num, 10);
        if (units === 'cm') {
            return parsedNum >= 150 && parsedNum <= 193;
        }
        if (units === 'in') {
            return parsedNum >= 59 && parsedNum <= 76;
        }
    },
    hcl: val => val.match(/^#[0-9a-f]{6}/),
    ecl: val => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(val),
    pid: val => val.length === 9 && /\d{9}/.test(val),
    cid: () => true,
};

const dataTransformer = data => data.replace(/\n/g, ' ').split('  ');

const machineA = vm({
    inputFile: '04-sample.txt',
    dataTransformer,
});

const machineB = vm({
    inputFile: '04.txt',
    dataTransformer,
});

const isValidPassport = passport => {
    const fields = Object.keys(requiredFields).filter(field => field !== 'cid');
    const hasAllFields = fields.every(field => passport.includes(`${field}:`));
    if (!hasAllFields) {
        return false;
    }

    const matches = passport.matchAll(/(\w{3}):([#\w]+)/g);
    for (const match of matches) {
        const [, field, value] = match;
        if (!requiredFields[field](value)) {
            return false;
        }
    }

    return true;
};

const getValidPassportsCount = data => data.filter(isValidPassport).length;

const validPassportsA = getValidPassportsCount(machineA.data);
const validPassportsB = getValidPassportsCount(machineB.data);

console.log(validPassportsA);
console.log(validPassportsB);
