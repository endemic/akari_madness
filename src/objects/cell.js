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
        this.status = Cell.STATUS.EMPTY;  // default
    };

    Cell.prototype = new Arcadia.Shape();

    Cell.STATUS = {
        EMPTY: 0,
        LIT: 1,
        LIGHT: 2,
        FLAG: 3,
        HINT: 4
    };

    // Cell.prototype.path = function (context) {
    // TODO: branch here based on status
    // };

    Cell.prototype.convertToLight = function () {
        this.color = 'green';
        this.status = Cell.STATUS.LIGHT;
    };

    Cell.prototype.convertToFlag = function () {
        this.color = 'red';
        this.status = Cell.STATUS.FLAG;
    };

    Cell.prototype.convertToEmpty = function () {
        this.color = 'white';
        this.status = Cell.STATUS.EMPTY;
    };

    Cell.prototype.convertToHint = function (number) {
        this.number = number;
        this.color = 'black';
        this.status = Cell.STATUS.HINT;

        if (this.number !== null) {
            this.label = new Arcadia.Label({
                font: '24px monospace',
                text: this.number
            });
            this.add(this.label);
        }
    };

    root.Cell = Cell;
}(window));
