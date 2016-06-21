/*jslint this: true, browser: true, for: true */
/*global Arcadia, window */

(function (root) {
    'use strict';

    var Grid;

    Grid = function (options) {
        Arcadia.Shape.apply(this, arguments);

        // this.data.size = options.size;
        this.data = options.data;

        this.size = {
            width: Grid.CELL_SIZE * this.data.size,
            height: Grid.CELL_SIZE * this.data.size
        };

        this.color = null;
        this.border = '2px black';
        var self = this;

        this.calculateBounds();

        this.cells = [];
        while (this.cells.length < Math.pow(this.data.size, 2)) {
            var x = this.cells.length % this.data.size;
            var y = Math.floor(this.cells.length / this.data.size);
            var c = new Cell({
                position: {
                    x: -this.size.width / 2 + (x * Grid.CELL_SIZE) + Grid.CELL_SIZE / 2,
                    y: -this.size.height / 2 + (y * Grid.CELL_SIZE) + Grid.CELL_SIZE / 2
                }
            });
            this.add(c);
            this.cells.push(c);
        }

        // Update hint cells
        this.data.hints.forEach(function (hint) {
            var x = hint.position.x;
            var y = hint.position.y;
            var index = self.data.size * y + x;
            self.cells[index].convertToHint(hint.number);
        });
    };

    Grid.prototype = new Arcadia.Shape();

    Grid.MAX_SIZE = 372;
    Grid.CELL_SIZE = Grid.MAX_SIZE / 10;

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

        var row = Math.floor((point.y - this.bounds.top) / Grid.CELL_SIZE);
        var column = Math.floor((point.x - this.bounds.left) / Grid.CELL_SIZE);

        return [row, column];
    };

    Grid.prototype.calculateBounds = function () {
        var right = this.size.width / 2;
        var bottom = this.size.height / 2;

        // Get bounds of user interactive area
        this.bounds = {
            right: right + this.position.x,
            left: (right - (Grid.CELL_SIZE * this.data.size)) + this.position.x,
            bottom: bottom + this.position.y,
            top: (bottom - (Grid.CELL_SIZE * this.data.size)) + this.position.y
        };
    };

    Grid.prototype.resize = function (newCellCount) {
        // Do nothing if passed a bogus arg
        newCellCount = newCellCount || this.data.size;

        this.data.size = newCellCount;

        this.size = {
            width: Grid.CELL_SIZE * this.data.size,
            height: Grid.CELL_SIZE * this.data.size
        };

        // Also resize the grid lines
        this.lines.size = this.size;

        this.calculateBounds();
    };

    Grid.prototype.onPointEnd = function (points) {
        var values = this.getRowAndColumn(points[0]);
        var row = values[0];
        var column = values[1];

        if (row === null || column === null) {
            return;
        }

        // Get clicked cell
        var index = row * this.data.size + column;
        var cell = this.cells[index];

        switch (cell.status) {
            case Cell.STATUS.EMPTY:
                // if not lit, place a light
                cell.convertToLight();
                // TODO: update the "lit" status of all the cells
                // in the same row/column
                break;
            case Cell.STATUS.LIT:
                // I think you can toggle flags here?
                break;
            case Cell.STATUS.LIGHT:
                // turn to a flag
                cell.convertToFlag();
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

            // if a cell is unlit, immediately return false
            if (cell.status === Cell.STATUS.EMPTY) {
                return false;
            }

            // If a cell is a hint, check for appropriate number of
            // lights around it
            if (cell.status === Cell.STATUS.HINT && cell.number) {
                var up = i - size;
                var left = i - 1;
                var right = i + 1;
                var bottom = i + size;

                var lightsCounter = 0;
                [up, left, right, bottom].forEach(function (index) {
                    if (this.cells[index] && this.cells[index].status === Cell.STATUS.LIGHT) {
                        lightsCounter += 1;
                    }
                }.bind(this));

                if (cell.number !== lightsCounter) {
                    return false;
                }
            }
        }

        return true;
    };

    root.Grid = Grid;
}(window));
