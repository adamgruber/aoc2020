function permuteArray(arr) {
    const results = [];
    const used = [];

    function permute(inputArray) {
        for (let i = 0; i < inputArray.length; i++) {
            // Grab single element from array
            const element = inputArray.splice(i, 1)[0];

            // Add element to list of used elements
            used.push(element);

            if (inputArray.length === 0) {
                results.push(used.slice());
            }

            permute(inputArray);
            inputArray.splice(i, 0, element);

            used.pop();
        }
        return results;
    }

    return permute(arr);
}

/**
 * Return a function that determines if a point is on a line
 * will check if a point is Determine if a given point is on a given segment
 * @param {object} segment Line segment (aX, aY, bX, bY)
 *
 * @return {function}
 */
function getLineEquation(segment) {
    const [x1, y1, x2, y2] = segment;

    // Calculate slope
    const m = (y2 - y1) / (x2 - x1);
    // Calculate y-intercept
    const b = y1 / (m * x1);

    console.log(`y = ${m}x + ${b}`);

    // y = mx + b
    return ({ x, y }) => y === m * x + b;
}

/**
 * Determine if a given point is on a given segment
 * @param {object} segment Line segment (aX, aY, bX, bY)
 * @param {object} point Point (x, y)
 *
 * @return {boolean}
 */
function pointIsOnSegment(segment, point) {
    // Determine if a given value is between the given start and end points
    function isBetween(start, end, val) {
        return (start < val && val < end) || (start > val && val > end);
    }

    // Make sure point is not same as segment start or end
    const [x1, y1, x2, y2] = segment;
    const { x, y } = point;

    // If point is one of the segment points, return false
    if ((x === x1 && y === y1) || (x === x2 && y === y2)) {
        return false;
    }

    // If segment is horizontal
    if (y1 === y2) {
        return y === y1 && isBetween(x1, x2, x);
    }

    // If segment is vertical
    if (x1 === x2) {
        return x === x1 && isBetween(y1, y2, y);
    }

    // Segment is arbitrary angle
    // Make sure point is within range
    if (isBetween(x1, x2, x) && isBetween(y1, y2, y)) {
        // Calculate slope and y-intercept
        const deltaY = y2 - y1;
        const deltaX = x2 - x1;

        // const m = deltaY / deltaX;
        // const b = y1 - m * x1;

        // console.log(dedent`
        //   segment: ${segment}
        //   point: ${point.x},${point.y}
        //   slope: ${m}
        //   intercept: ${b}
        //   equation: ${`y = ${m}x + ${b}`}
        // `);

        // Avoid division due to floating point rounding errors
        const isOnSegment =
            deltaX * y === x * deltaY + deltaX * y1 - deltaY * x1;

        return isOnSegment;
    }

    return false;
}

module.exports = {
    permuteArray,
    pointIsOnSegment,
};
