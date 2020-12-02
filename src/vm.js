const fs = require('fs');
const path = require('path');

function sum(...args) {
    return args.reduce((acc, val) => acc + val, 0);
}

class VM {
    constructor(options) {
        this.options = options;

        this.readInput();
    }

    readInput() {
        const { inputFile, dataTransformer } = this.options;

        if (!inputFile) {
            return;
        }

        const filePath = path.resolve(
            path.join(__dirname, '../inputs', inputFile)
        );

        try {
            this.data = fs.readFileSync(filePath, 'utf8');
            if (dataTransformer) {
                this.data = dataTransformer(this.data);
            }
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = options => {
    const vm = new VM(options);
    return vm;
};
