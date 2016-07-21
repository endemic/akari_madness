var LEVELS = [
    // https://en.wikipedia.org/wiki/Light_Up_(puzzle)
    // Basically need to have an (x, y) position for black squares,
    // as well as an (optional) number on each one
    // (x, y) starts in upper left, which is (0, 0)
    // Oh yeah, also the size of the grid
    {
        size: 8,
        hints: [
            {position: {x: 5, y: 0}, number: 1},
            {position: {x: 1, y: 1}, number: 3},
            {position: {x: 2, y: 1}, number: null},
            {position: {x: 6, y: 2}, number: 0},
            {position: {x: 0, y: 3}, number: null},
            {position: {x: 4, y: 3}, number: null},
            {position: {x: 3, y: 4}, number: 4},
            {position: {x: 7, y: 4}, number: 0},
            {position: {x: 1, y: 5}, number: 2},
            {position: {x: 5, y: 6}, number: 1},
            {position: {x: 6, y: 6}, number: null},
            {position: {x: 2, y: 7}, number: null},
        ]
    }
];

if (!localStorage.getObject('puzzles')) {
    localStorage.setObject('puzzles', LEVELS);
}

LEVELS = localStorage.getObject('puzzles');
