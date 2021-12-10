var PUZZLES = [
    {"size":5,"hints":[{"position":{"x":0,"y":0},"number":2},{"position":{"x":2,"y":3},"number":2},{"position":{"x":4,"y":4},"number":1}]},
    {"size":5,"hints":[{"position":{"x":0,"y":0},"number":null},{"position":{"x":2,"y":2},"number":4},{"position":{"x":4,"y":4},"number":null}]},
    {"size":5,"hints":[{"position":{"x":3,"y":0},"number":3},{"position":{"x":0,"y":3},"number":1}]},
    {"size":5,"hints":[{"position":{"x":3,"y":2},"number":1},{"position":{"x":4,"y":2},"number":2},{"position":{"x":1,"y":3},"number":0}]},
    {"size":5,"hints":[{"position":{"x":1,"y":1},"number":3},{"position":{"x":3,"y":2},"number":null},{"position":{"x":0,"y":4},"number":1},{"position":{"x":4,"y":4},"number":1}]},
    {"size":5,"hints":[{"position":{"x":1,"y":1},"number":2},{"position":{"x":2,"y":1},"number":0},{"position":{"x":1,"y":3},"number":1},{"position":{"x":2,"y":3},"number":1}]},
    {"size":5,"hints":[{"position":{"x":0,"y":0},"number":2},{"position":{"x":2,"y":3},"number":2},{"position":{"x":4,"y":4},"number":1}]},
    {"size":5,"hints":[{"position":{"x":0,"y":0},"number":null},{"position":{"x":2,"y":2},"number":4},{"position":{"x":4,"y":4},"number":null}]},
    {"size":5,"hints":[{"position":{"x":3,"y":0},"number":3},{"position":{"x":0,"y":3},"number":1}]},
    {"size":5,"hints":[{"position":{"x":3,"y":2},"number":1},{"position":{"x":4,"y":2},"number":2},{"position":{"x":1,"y":3},"number":0}]},
    {"size":5,"hints":[{"position":{"x":1,"y":1},"number":3},{"position":{"x":3,"y":2},"number":null},{"position":{"x":0,"y":4},"number":1},{"position":{"x":4,"y":4},"number":1}]},
    {"size":5,"hints":[{"position":{"x":1,"y":1},"number":2},{"position":{"x":2,"y":1},"number":0},{"position":{"x":1,"y":3},"number":1},{"position":{"x":2,"y":3},"number":1}]},
    {"size":5,"hints":[{"position":{"x":1,"y":1},"number":3},{"position":{"x":3,"y":2},"number":null},{"position":{"x":1,"y":3},"number":2}]},
    {"size":6,"hints":[{"position":{"x":5,"y":0},"number":0},{"position":{"x":3,"y":2},"number":2},{"position":{"x":5,"y":2},"number":0},{"position":{"x":0,"y":3},"number":0},{"position":{"x":2,"y":3},"number":2},{"position":{"x":0,"y":5},"number":0}]},
    {"size":6,"hints":[{"position":{"x":1,"y":0},"number":null},{"position":{"x":1,"y":1},"number":0},{"position":{"x":3,"y":2},"number":2},{"position":{"x":1,"y":4},"number":null},{"position":{"x":2,"y":4},"number":0}]},
    {"size":7,"hints":[{"position":{"x":0,"y":0},"number":null},{"position":{"x":1,"y":1},"number":2},{"position":{"x":3,"y":2},"number":null},{"position":{"x":4,"y":3},"number":1},{"position":{"x":1,"y":5},"number":null},{"position":{"x":0,"y":6},"number":1}]},
    {"size":7,"hints":[{"position":{"x":2,"y":1},"number":null},{"position":{"x":5,"y":1},"number":0},{"position":{"x":2,"y":2},"number":null},{"position":{"x":2,"y":3},"number":null},{"position":{"x":3,"y":3},"number":2},{"position":{"x":5,"y":5},"number":0}]},
    {"size":7,"hints":[{"position":{"x":2,"y":1},"number":null},{"position":{"x":1,"y":2},"number":2},{"position":{"x":2,"y":3},"number":2},{"position":{"x":4,"y":3},"number":null},{"position":{"x":5,"y":4},"number":2},{"position":{"x":4,"y":5},"number":null}]},
    {"size":7,"hints":[{"position":{"x":1,"y":1},"number":null},{"position":{"x":3,"y":3},"number":3},{"position":{"x":4,"y":3},"number":1},{"position":{"x":1,"y":5},"number":null}]},
    {"size":8,"hints":[{"position":{"x":2,"y":1},"number":2},{"position":{"x":4,"y":1},"number":2},{"position":{"x":6,"y":1},"number":1},{"position":{"x":1,"y":6},"number":1},{"position":{"x":3,"y":6},"number":2},{"position":{"x":5,"y":6},"number":2}]},
    {"size":8,"hints":[{"position":{"x":3,"y":1},"number":2},{"position":{"x":2,"y":2},"number":1},{"position":{"x":3,"y":2},"number":0},{"position":{"x":6,"y":4},"number":null},{"position":{"x":7,"y":4},"number":1},{"position":{"x":2,"y":5},"number":1},{"position":{"x":2,"y":6},"number":1},{"position":{"x":1,"y":7},"number":null}]},
    {"size":8,"hints":[{"position":{"x":5,"y":0},"number":1},{"position":{"x":1,"y":1},"number":3},{"position":{"x":2,"y":1},"number":null},{"position":{"x":6,"y":2},"number":0},{"position":{"x":0,"y":3},"number":null},{"position":{"x":4,"y":3},"number":null},{"position":{"x":3,"y":4},"number":4},{"position":{"x":7,"y":4},"number":0},{"position":{"x":1,"y":5},"number":2},{"position":{"x":5,"y":6},"number":1},{"position":{"x":6,"y":6},"number":null},{"position":{"x":2,"y":7},"number":null}]},
    {"size":8,"hints":[{"position":{"x":5,"y":0},"number":1},{"position":{"x":1,"y":1},"number":3},{"position":{"x":2,"y":1},"number":null},{"position":{"x":6,"y":2},"number":0},{"position":{"x":0,"y":3},"number":null},{"position":{"x":4,"y":3},"number":null},{"position":{"x":3,"y":4},"number":4},{"position":{"x":7,"y":4},"number":0},{"position":{"x":1,"y":5},"number":2},{"position":{"x":5,"y":6},"number":1},{"position":{"x":6,"y":6},"number":null},{"position":{"x":2,"y":7},"number":null}]},
    {"size":9,"hints":[{"position":{"x":1,"y":1},"number":2},{"position":{"x":3,"y":3},"number":2},{"position":{"x":5,"y":5},"number":2},{"position":{"x":7,"y":7},"number":2}]}
];

if (!localStorage.getObject('puzzles')) {
    localStorage.setObject('puzzles', PUZZLES);
}

PUZZLES = localStorage.getObject('puzzles');
