/*jslint this: true, browser: true */
/*global Arcadia, window, Grid */

(function (root) {
    'use strict';

    var Cell;

    Cell = function () {
        Arcadia.Shape.apply(this, arguments);

        this.size = {width: Grid.CELL_SIZE, height: Grid.CELL_SIZE};
        this.vertices = 4;
        this.color = 'white';
        this.border = '1px black';
        this.status = Cell.STATUS.EMPTY;

        // Keeps track if cell is "lit" by more than one
        // light... this value needs to be "1" for all lit
        // cells for the puzzle to be complete
        this.lightSources = 0;

        // Show a "flag" or "light", based on cell state
        this.icon = new Arcadia.Shape({
            size: {
                width: this.size.width / 2,
                height: this.size.height / 2
            },
            color: 'black'
        });
        this.add(this.icon);
        this.deactivate(this.icon);

        // Used for the "hint" state
        this.label = new Arcadia.Label({
            font: '24px monospace',
            text: this.number
        });
        this.add(this.label);
        this.deactivate(this.label);
    };

    Cell.prototype = new Arcadia.Shape();

    Cell.STATUS = {
        EMPTY: 0,
        LIGHT: 2,
        FLAG: 3,
        HINT: 4
    };

    Cell.prototype.incrementLightSources = function () {
        this.lightSources += 1;

        if (this.lightSources === 1) {
            this.color = 'teal';
        }
    };

    Cell.prototype.decrementLightSources = function () {
        this.lightSources -= 1;

        if (this.lightSources <= 0) {
            this.lightSources = 0;
            this.color = 'white';
        }
    };

    /* TODO: combine all these conversion methods into a single
    method that uses a switch statement, so we can ensure integrity
    of state change order; i.e. empty -> light -> flag -> empty */

    Cell.prototype.convertToLight = function () {
        this.status = Cell.STATUS.LIGHT;
        this.activate(this.icon);
        this.icon.vertices = 0;
    };

    Cell.prototype.convertToFlag = function () {
        this.status = Cell.STATUS.FLAG;
        this.icon.vertices = 4;

        // this.icon.path = function (context) {
        //     // draw a flag here
        //     // something something * Arcadia.PIXEL_RATIO
        //     var x = -this.size.width / 2 * Arcadia.PIXEL_RATIO;
        //     var y = -this.size.height / 2 * Arcadia.PIXEL_RATIO;
        //     var width = this.size.width * Arcadia.PIXEL_RATIO;
        //     var height = this.size.height * Arcadia.PIXEL_RATIO;
        //     context.lineWidth = 5 * Arcadia.PIXEL_RATIO;
        //     context.strokeRect(x, y, width, height);
        // };
        // this.icon.dirty = true; // trigger redraw
    };

    Cell.prototype.convertToEmpty = function () {
        this.number = null;
        this.color = 'white';
        if (this.lightSources > 0) {
            this.color = 'teal';
        }
        this.status = Cell.STATUS.EMPTY;
        this.deactivate(this.icon);
        this.deactivate(this.label);
    };

    Cell.prototype.convertToHint = function (number) {
        // Funky condition here, because `0` (a valid hint #) evals to `false`
        this.number = Number.isInteger(number) ? number : null;
        this.color = 'black';
        this.status = Cell.STATUS.HINT;

        if (this.number !== null) {
            this.label.text = this.number;
            this.activate(this.label);
        }
    };

    root.Cell = Cell;
}(window));
