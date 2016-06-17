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
                    x: -this.size.width / 2 + (x * Grid.CELL_SIZE) + Cell.SIZE / 2,
                    y: -this.size.height / 2 + (y * Grid.CELL_SIZE) + Cell.SIZE / 2
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
            self.cells[index].convertToHint(hint.number)
        });

        this.lines = new Arcadia.Shape({
            size: {
                width: this.size.width,
                height: this.size.height
            }
        });

        this.lines.path = function (context) {
            var left = -self.size.width / 2;
            var right = self.size.width / 2;
            var top = -self.size.height / 2;
            var bottom = self.size.height / 2;

            var i;

            for (i = 0; i <= self.data.size; i += 1) {
                // Horizontal lines
                context.moveTo(left * Arcadia.PIXEL_RATIO, (bottom - Grid.CELL_SIZE * i) * Arcadia.PIXEL_RATIO);
                context.lineTo(right * Arcadia.PIXEL_RATIO, (bottom - Grid.CELL_SIZE * i) * Arcadia.PIXEL_RATIO);

                // Vertical lines
                context.moveTo((right - Grid.CELL_SIZE * i) * Arcadia.PIXEL_RATIO, top * Arcadia.PIXEL_RATIO);
                context.lineTo((right - Grid.CELL_SIZE * i) * Arcadia.PIXEL_RATIO, bottom * Arcadia.PIXEL_RATIO);
            }

            // Draw grid
            context.lineWidth = self._border.width * Arcadia.PIXEL_RATIO;
            context.strokeStyle = self._border.color;
            console.log(context.lineWidth, context.strokeStyle);
            context.stroke();
        };
        this.add(this.lines);
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

    root.Grid = Grid;
}(window));
