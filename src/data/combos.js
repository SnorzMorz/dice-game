export const combos = [
    { name: 'Pair', points: 5, test: faces => faces.some((v, i, a) => a.indexOf(v) !== i) },
    { name: 'Triple', points: 10, test: faces => faces.some(v => faces.filter(x => x === v).length === 3) },
    {
        name: 'Straight', points: 15, test: faces => {
            const set = new Set(faces);
            return set.size === faces.length && Math.max(...faces) - Math.min(...faces) === faces.length - 1;
        }
    },
];