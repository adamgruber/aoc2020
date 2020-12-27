const vm = require('./vm');

const dataTransformer = data => data.split('\n');

const { data: input } = vm({
    inputFile: '18.txt',
    dataTransformer,
});

const evaluateExpression = (exp, order) => {
    function evalLeftToRight() {
        while (exp.match(/[*+]/)) {
            exp = exp.replace(/\d+[*+]\d+/, match => eval(match));
        }
    }

    // Evaluate addition
    function evalAddition() {
        while (exp.match(/\+/)) {
            exp = exp.replace(/\d+\+\d+/, match => eval(match));
        }
    }

    // Evaluate multiplication
    function evalMultiplication() {
        while (exp.match(/\*/)) {
            exp = exp.replace(/\d+\*\d+/, match => eval(match));
        }
    }

    if (order === 'ltr') {
        evalLeftToRight(exp);
    } else if (order === '+*') {
        evalAddition(exp);
        evalMultiplication(exp);
    }

    // Evaluate final expression
    return eval(exp);
};

const evaluateLine = (exp, order) => {
    exp = exp.replace(/\s/g, '');

    // Evaluate expressions inside parens until there are none left
    while (exp.match(/\(|\)/)) {
        exp = exp.replace(/\([^(]+?\)/g, match =>
            evaluateExpression(match, order)
        );
    }

    // Evaluate final expression
    return evaluateExpression(exp, order);
};

const sumPart1 = input
    .map(line => evaluateLine(line, 'ltr'))
    .reduce((acc, val) => acc + val);
console.log(sumPart1);

const sumPart2 = input
    .map(line => evaluateLine(line, '+*'))
    .reduce((acc, val) => acc + val);
console.log(sumPart2);
