/*jslint this, browser */
/*global Arcadia, window, TitleScene */

(function (root) {
    'use strict';

    var RulesScene = function () {
        Arcadia.Scene.apply(this);

        Arcadia.cycleBackground();

        var text = [
            'Tap + drag on the puzzle\n',
            'grid to draw. Each number\n',
            'on the grid is a clue; the\n',
            'number represents the size\n',
            'of the rectangle that\n',
            'overlaps it. For example,\n',
            'a clue of "9" means that\n',
            'you need to draw a 3x3\n',
            'square on top of that\n',
            'clue. The trick is to draw\n',
            'each square and rectangle\n',
            'so that there\'s no wasted\n',
            'space on the grid. You\n',
            'can\'t overlap squares,\n',
            'either. Fortunately,\n',
            'there\'s no time limit,\n',
            'and you can always try\n',
            'again if you make a\n',
            'mistake.'
        ];

        var titleLabel = new Arcadia.Label({
            text: 'rules',
            font: '64px monospace',
            position: {x: 0, y: -this.size.height / 2 + 110}
        });
        this.add(titleLabel);

        var backButton = new Arcadia.Button({
            position: {x: -this.size.width / 2 + 65, y: -this.size.height / 2 + 25},
            size: {width: 120, height: 40},
            color: null,
            border: '2px white',
            text: '< title',
            font: '24px monospace',
            action: function () {
                window.sona.play('button');
                Arcadia.changeScene(TitleScene);
            }
        });
        this.add(backButton);

        var detailLabel = new Arcadia.Label({
            text: text.join(''),
            // alignment: 'left',
            font: '24px monospace',
            position: {x: 0, y: 75}
        });
        this.add(detailLabel);
    };

    RulesScene.prototype = new Arcadia.Scene();

    root.RulesScene = RulesScene;
}(window));
