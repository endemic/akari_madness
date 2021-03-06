/*jslint this: true, browser: true, for: true */
/*global Arcadia, window */

(function (root) {
    'use strict';

    var Grid;

    Grid = function (options) {
        Arcadia.Shape.apply(this, arguments);

        this.data = options.data || {size: 10, hints: []};

        this.size = {
            width: Grid.CELL_WIDTH * this.data.size,
            height: Grid.CELL_HEIGHT * this.data.size
        };
        this.color = null;
        this.border = '2px black';

        // Default to "play," rather than "edit"
        this.mode = Grid.MODES.PLAY;

        this.calculateBounds();

        // Create grid cells
        this.cells = [];
        while (this.cells.length < Math.pow(this.data.size, 2)) {
            var x = this.cells.length % this.data.size;
            var y = Math.floor(this.cells.length / this.data.size);
            var c = new Cell({
                position: {
                    x: -this.size.width / 2 + (x * Grid.CELL_WIDTH) + Grid.CELL_WIDTH / 2,
                    y: -this.size.height / 2 + (y * Grid.CELL_HEIGHT) + Grid.CELL_HEIGHT / 2
                }
            });
            this.add(c);
            this.cells.push(c);
        }

        // Update cells used for hints
        this.data.hints.forEach(function (hint) {
            var x = hint.position.x;
            var y = hint.position.y;
            var index = this.data.size * y + x;
            this.cells[index].convertToHint(hint.number);
        }.bind(this));
    };

    Grid.prototype = new Arcadia.Shape();

    Grid.MAX_SIZE = 10;
    Grid.MIN_SIZE = 5;

    Grid.MAX_WIDTH = Grid.MAX_HEIGHT = 372;
    Grid.CELL_WIDTH = Grid.MAX_WIDTH / 10;
    Grid.CELL_HEIGHT = Grid.MAX_HEIGHT / 10;

    Grid.MODES = {
        PLAY: 'play',
        EDIT: 'edit'
    };

    Grid.prototype.containsPoint = function (point) {
        return point.x < this.bounds.right &&
                point.x > this.bounds.left &&
                point.y < this.bounds.bottom &&
                point.y > this.bounds.top;
    };

    Grid.prototype.getRowAndColumn = function (point) {
        if (!this.containsPoint(point)) {
            return [null, null];
        }

        var row = Math.floor((point.y - this.bounds.top) / Grid.CELL_WIDTH);
        var column = Math.floor((point.x - this.bounds.left) / Grid.CELL_HEIGHT);

        return [row, column];
    };

    Grid.prototype.calculateBounds = function () {
        var right = this.size.width / 2;
        var bottom = this.size.height / 2;

        // Get bounds of user interactive area
        this.bounds = {
            right: right + this.position.x,
            left: (right - (Grid.CELL_WIDTH * this.data.size)) + this.position.x,
            bottom: bottom + this.position.y,
            top: (bottom - (Grid.CELL_HEIGHT * this.data.size)) + this.position.y
        };
    };

    Grid.prototype.resize = function (newSize) {
        if (!Number.isInteger(newSize)) {
            return;
        }

        this.data.size = newSize;

        // Add new cells if necessary
        while (this.cells.length < Math.pow(this.data.size, 2)) {
            var c = new Cell();
            this.add(c);
            this.cells.push(c);
        }

        this.size = {
            width: Grid.CELL_WIDTH * this.data.size,
            height: Grid.CELL_HEIGHT * this.data.size
        };

        // Hide all cells, then show correct # of cells
        this.cells.forEach(function (cell) {
            this.deactivate(cell);
        }.bind(this));

        this.cells.forEach(function (cell, index) {
            if (index >= Math.pow(this.data.size, 2)) {
                return;
            }

            this.activate(cell);
            var x = index % this.data.size;
            var y = Math.floor(index / this.data.size);

            cell.position = {
                x: -this.size.width / 2 + (x * Grid.CELL_WIDTH) + Grid.CELL_WIDTH / 2,
                y: -this.size.height / 2 + (y * Grid.CELL_HEIGHT) + Grid.CELL_HEIGHT / 2
            };
        }.bind(this));

        this.calculateBounds();
    };

    Grid.prototype.onPointEnd = function (points) {
        var values = this.getRowAndColumn(points[0]);
        var row = values[0];
        var column = values[1];

        if (row === null || column === null) {
            return;
        }

        // Get selected cell
        var size = this.data.size;
        var index = row * size + column;
        var cell = this.cells[index];

        // Editor mode
        if (this.mode === Grid.MODES.EDIT) {
            switch (cell.status) {
            case Cell.STATUS.EMPTY:
                cell.convertToHint();
                break;
            case Cell.STATUS.HINT:
                if (cell.number >= 4) {
                    cell.convertToEmpty();
                } else if (cell.number !== null) {
                    cell.convertToHint(cell.number + 1);
                } else {
                    cell.convertToHint(0);
                }
                break;
            }

            // Exit early to avoid "normal" gameplay handling
            return;
        }

        switch (cell.status) {
            case Cell.STATUS.EMPTY:
                // place a light
                cell.convertToLight();

                var i;

                // Go to the left of the light
                for (i = index - 1; i >= row * size; i -= 1) {
                    if (this.cells[i].status === Cell.STATUS.HINT) {
                        break;
                    }
                    this.cells[i].incrementLightSources();
                }

                // Go to the right of the light
                for (i = index + 1; i < row * size + size; i += 1) {
                    if (this.cells[i].status === Cell.STATUS.HINT) {
                        break;
                    }
                    this.cells[i].incrementLightSources();
                }

                // Go up from the light
                for (i = index - size; i >= 0; i -= size) {
                    if (this.cells[i].status === Cell.STATUS.HINT) {
                        break;
                    }
                    this.cells[i].incrementLightSources();
                }

                // Go down from the light
                for (i = index + size; i < Math.pow(size, 2); i += size) {
                    if (this.cells[i].status === Cell.STATUS.HINT) {
                        break;
                    }
                    this.cells[i].incrementLightSources();
                }

                // Increment the light source itself
                cell.incrementLightSources();

                break;
            case Cell.STATUS.LIGHT:
                // turn to a flag
                cell.convertToFlag();

                var i;

                // Go to the left of the light
                for (i = index - 1; i >= row * size; i -= 1) {
                    if (this.cells[i].status === Cell.STATUS.HINT) {
                        break;
                    }
                    this.cells[i].decrementLightSources();
                }

                // Go to the right of the light
                for (i = index + 1; i < row * size + size; i += 1) {
                    if (this.cells[i].status === Cell.STATUS.HINT) {
                        break;
                    }
                    this.cells[i].decrementLightSources();
                }

                // Go up from the light
                for (i = index - size; i >= 0; i -= size) {
                    if (this.cells[i].status === Cell.STATUS.HINT) {
                        break;
                    }
                    this.cells[i].decrementLightSources();
                }

                // Go down from the light
                for (i = index + size; i < Math.pow(size, 2); i += size) {
                    if (this.cells[i].status === Cell.STATUS.HINT) {
                        break;
                    }
                    this.cells[i].decrementLightSources();
                }

                // Increment the light source itself
                cell.decrementLightSources();
                break;
            case Cell.STATUS.FLAG:
                // turn empty
                cell.convertToEmpty();
                break;
            case Cell.STATUS.HINT:
                // do nothing, can't modify these
                break;
            default:
                console.warn('Unknown cell status!', cell.status);
                break;
        }
    };

    Grid.prototype.isComplete = function () {
        var size = this.data.size;

        for (var i = 0; i < this.cells.length; i += 1) {
            var cell = this.cells[i];

            // fail if a cell is unlit
            if (cell.status !== Cell.STATUS.HINT && cell.lightSources < 1) {
                console.log('Cell ', i, ' is not lit');
                return false;
            }

            // fail if a light is on an already-lit cell
            if (cell.status === Cell.STATUS.LIGHT && cell.lightSources > 1) {
                console.log('Cell ', i, ' has more than one light source');
                return false;
            }

            // If a cell is a hint, check for appropriate number of
            // lights around it
            if (cell.status === Cell.STATUS.HINT && cell.number) {
                var up = i - size;
                var left = i - 1;
                var right = i + 1;
                var down = i + size;

                // consider cells at the edge of the grid
                if (up < 0) {
                    up = null;
                }

                if (down >= this.cells.length) {
                    down = null;
                }

                if (Math.floor(left / size) !== Math.floor(i / size)) {
                    left = null;
                }

                if (Math.floor(right / size) !== Math.floor(i / size)) {
                    right = null;
                }

                var lightsCounter = 0;
                [up, down, left, right].forEach(function (index) {
                    if (index && this.cells[index].status === Cell.STATUS.LIGHT) {
                        lightsCounter += 1;
                    }
                }.bind(this));

                if (cell.number !== lightsCounter) {
                    console.log('Cell ', i, ' has ', lightsCounter, ' lights around it, but needs ', cell.number);
                    return false;
                }
            }
        }

        return true;
    };

    Grid.prototype.reset = function () {
        this.cells.forEach(function (cell) {
            if (cell.status !== Cell.STATUS.HINT) {
                cell.reset();
            }
        });
    };

    root.Grid = Grid;
}(window));
