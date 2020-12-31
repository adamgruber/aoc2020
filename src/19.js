const vm = require('./vm');

const dataTransformer = data => {
    const [r, msg] = data.split('\n\n');
    const messages = msg.split('\n');
    const rules = r.split('\n').reduce((acc, rule) => {
        const [idx, def] = rule.split(':');
        acc[idx] = def.trim().replace(/"/g, '');
        return acc;
    }, {});

    return { rules, messages };
};

const { data: input } = vm({
    inputFile: '19.txt',
    dataTransformer,
});

const solve = ({ rules, messages }, fix) => {
    const makeRegex = idx => {
        if (/a|b/.test(idx)) {
            return '';
        }

        if (fix) {
            if (idx === '8') {
                return `(${makeRegex(42)})+`;
            }

            if (idx === '11') {
                return `(${Array.from(Array(20).keys())
                    .map(
                        n =>
                            `((${makeRegex(42)}){${n + 1}}(${makeRegex(31)}){${
                                n + 1
                            }})`
                    )
                    .join('|')})`;
            }
        }

        let rule = rules[idx];

        if (/a|b/.test(rule)) {
            return rule;
        }

        const assemble = r =>
            r
                .split(' ')
                .map(r => {
                    const re = makeRegex(r);
                    return /a|b/.test(re) ? re : `(${re})`;
                })
                .join('');

        if (rule.includes('|')) {
            return `(${rule.split(' | ').map(assemble).join('|')})`;
        }

        return assemble(rule);
    };
    const reg = new RegExp(`^${makeRegex(0)}$`);
    return messages.filter(m => reg.test(m)).length;
};

console.log(solve(input));
console.log(solve(input, true));
