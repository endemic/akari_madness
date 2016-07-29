	/*jslint this: true, browser: true */
/*global Arcadia, window, PUZZLES */

(function (root) {
    'use strict';

    var Thumbnail;

    Thumbnail = function () {
        Arcadia.Shape.apply(this, arguments);

        this.size = {
            width: Thumbnail.SIZE,
            height: Thumbnail.SIZE
        };

        this.border = '2px white';
        this.color = null;

        this.pixels = new Arcadia.Shape({
            size: {
                width: this.size.width,
                height: this.size.height
            }
        });

        this.pixels.path = function (context) {
            if (!this.hints) {
                return;
            }

            var pixelSize = this.size.width / this.puzzleSize * Arcadia.PIXEL_RATIO;
            var originX = -this.size.width / 2 * Arcadia.PIXEL_RATIO;
            var originY = -this.size.height / 2 * Arcadia.PIXEL_RATIO;

            context.fillStyle = 'white';

            this.hints.forEach(function (hint) {
                var x = hint.position.x;
                var y = hint.position.y;

                context.fillRect(originX + (hint.position.x * pixelSize),
		                         originY + (hint.position.y * pixelSize),
		                         pixelSize,
		                         pixelSize);
            });
        };

        this.add(this.pixels);
    };

    Thumbnail.prototype = new Arcadia.Shape();

    Thumbnail.SIZE = 75;

    Thumbnail.prototype.drawPreview = function (index, complete) {
        // Can't draw a preview without data
        // TODO: maybe don't rely on global var here
        if (PUZZLES[index] === undefined) {
            this.alpha = 0;
            return;
        }

        if (this.alpha < 1) {
            this.alpha = 1;
        }

        if (complete) {
            this.border = '2px limegreen';
        } else if (Arcadia.isLocked() && index >= Arcadia.FREE_LEVEL_COUNT) {
            this.border = '2px crimson';
        } else {
            this.border = '2px white';
        }

        this.pixels.puzzleSize = PUZZLES[index].size;
        this.pixels.hints = PUZZLES[index].hints;
        this.pixels.dirty = true;
    };

    Thumbnail.prototype.highlight = function () {
        this._border.width = 5;
        this.dirty = true;
        this.scale = 1.1;
    };

    Thumbnail.prototype.lowlight = function () {
        this._border.width = 2;
        this.dirty = true;
        this.scale = 1;
    };

    root.Thumbnail = Thumbnail;
}(window));
