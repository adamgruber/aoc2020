const vm = require('./vm');

const sample = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;

const dataTransformer = data => data.split('\n');

const { data: input } = vm({
    inputFile: '08.txt',
    dataTransformer,
});

const fixProgram = data => {
    const opIndexes = data.reduce((acc, inst, idx) => {
        if (/nop|jmp/.test(inst)) {
            acc.push(idx);
        }
        return acc;
    }, []);

    const getNextCode = instIdx => {
        const newCode = [...data];
        const instruction = newCode[instIdx];
        let newInst;
        if (instruction.includes('nop')) {
            newInst = instruction.replace('nop', 'jmp');
        } else {
            newInst = instruction.replace('jmp', 'nop');
        }

        newCode[instIdx] = newInst;
        return newCode;
    };

    const runBootCode = code => {
        let acc = 0;
        let idx = 0;
        const visited = [];
        let loops = false;

        while (!visited.includes(idx)) {
            visited.push(idx);
            const instruction = code[idx];
            if (!instruction) {
                break;
            }

            let nextIdx;

            const [, inst, val] = instruction.match(/^(\w+) ([+-]\d+)$/);
            const parsedVal = parseInt(val, 10);
            const nopIdx = idx + 1;
            const jmpIdx = idx + parsedVal;

            switch (inst) {
                case 'acc':
                    acc += parsedVal;
                    nextIdx = idx + 1;
                    break;

                case 'nop': {
                    nextIdx = nopIdx;
                    break;
                }

                case 'jmp':
                    nextIdx = jmpIdx;
                    break;

                default:
                // noop
            }

            if (visited.includes(nextIdx)) {
                loops = true;
                break;
            }

            idx = nextIdx;
        }

        if (loops) {
            const switchIndex = opIndexes.shift();
            const nextCode = getNextCode(switchIndex);
            return runBootCode(nextCode);
        }

        return acc;
    };

    return runBootCode(data);
};

console.log(fixProgram(dataTransformer(sample)));
console.log(fixProgram(input));
