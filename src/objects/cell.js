/*jslint this: true, browser: true */
/*global Arcadia, window */

(function (root) {
    'use strict';

    var Cell;

    Cell = function (args) {
        Arcadia.Shape.apply(this, arguments);

        this.size = {width: Cell.SIZE, height: Cell.SIZE};
        this.vertices = 4;
        this.color = 'white';
        this.status = Cell.STATUS.EMPTY;  // default
    };

    Cell.prototype = new Arcadia.Shape();

    Cell.SIZE = 37.5; // 375 / 10 = 37.5
    Cell.STATUS = {
        EMPTY: 0,
        LIT: 1,
        LIGHT: 2,
        FLAG: 3,
        HINT: 4
    };

    // Cell.prototype.path = function (context) {
    //
    // };

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
