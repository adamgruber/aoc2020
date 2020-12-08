const vm = require('./vm');

const dataTransformer = data =>
    data.split('\n').reduce((acc, rule) => {
        rule = rule.split(' bags contain ');
        const decl = rule[0];
        const def = rule[1].split(', ');
        const [, variant, color] = decl.match(/^(\w+) (\w+)/);
        const defObj = def.reduce((acc, d) => {
            const [, count, v, c] = d.match(/^(\d+) (\w+) (\w+)/) || [];
            return count
                ? {
                      ...acc,
                      [`${v}_${c}`]: count,
                  }
                : acc;
        }, {});

        return {
            ...acc,
            [`${variant}_${color}`]: defObj,
        };
    }, {});

const { data: input } = vm({
    inputFile: '07.txt',
    dataTransformer,
});

const variantCanCarryBagType = (variant, bagType, rules) => {
    const allowedChildBagTypes = Object.keys(rules[variant]);
    return allowedChildBagTypes.includes(bagType)
        ? true
        : allowedChildBagTypes.some(childBagType =>
              variantCanCarryBagType(childBagType, bagType, rules)
          );
};

const findBagsThatCanCarryBagType = bagType =>
    Object.keys(input).filter(variant =>
        variantCanCarryBagType(variant, bagType, input)
    );

const getTotalBagsWithinVariant = (variant, rules, total = 0) => {
    const containedBags = Object.entries(rules[variant]);
    return containedBags.reduce((acc, [bagType, count]) => {
        count = parseInt(count, 10);
        return (
            acc +
            count +
            count * getTotalBagsWithinVariant(bagType, rules, total)
        );
    }, total);
};

// Part 1
console.log(findBagsThatCanCarryBagType('shiny_gold').length);

// Part 2
console.log(getTotalBagsWithinVariant('shiny_gold', input));
