/*jslint this, browser */
/*global Arcadia, window, PUZZLES, RulesScene, LevelSelectScene, UnlockScene, GameScene */

(function (root) {
    'use strict';

    var TitleScene = function () {
        Arcadia.Scene.apply(this);

        Arcadia.cycleBackground();

        var BUTTON_MARGIN = 10;

        var titleLabel = new Arcadia.Label({
            text: 'akari\nmadness',
            font: '64px monospace',
            position: {x: 0, y: -100}
        });

        this.add(titleLabel);

        var playButton = new Arcadia.Button({
            position: {x: 0, y: 80},
            size: {width: 180, height: 50},
            color: null,
            border: '2px white',
            text: 'play',
            font: '36px monospace',
            action: function () {
                window.sona.play('button');

                var completedPuzzles = localStorage.getObject('completedPuzzles') || [];
                while (completedPuzzles.length < PUZZLES.length) {
                    completedPuzzles.push(null);
                }
                var incompletePuzzleIndex = completedPuzzles.indexOf(null);

                // TOOO: Extract this code from here & game scene
                if (incompletePuzzleIndex === -1) {
                    Arcadia.changeScene(LevelSelectScene);
                } else if (Arcadia.isLocked() && incompletePuzzleIndex >= Arcadia.FREE_LEVEL_COUNT) {
                    Arcadia.changeScene(UnlockScene);
                } else {
                    Arcadia.changeScene(GameScene, {level: incompletePuzzleIndex});
                }
            }
        });
        this.add(playButton);

        var rulesButton = new Arcadia.Button({
            position: {x: 0, y: playButton.position.y + playButton.size.height + BUTTON_MARGIN},
            size: {width: 180, height: 50},
            color: null,
            border: '2px white',
            text: 'rules',
            font: '36px monospace',
            action: function () {
                window.sona.play('button');
                Arcadia.changeScene(RulesScene);
            }
        });
        this.add(rulesButton);

        var aboutButton = new Arcadia.Button({
            position: {x: 0, y: rulesButton.position.y + rulesButton.size.height + BUTTON_MARGIN},
            size: {width: 180, height: 50},
            color: null,
            border: '2px white',
            text: 'about',
            font: '36px monospace',
            action: function () {
                sona.play('button');
                Arcadia.changeScene(AboutScene);
            }
        });
        this.add(aboutButton);
    };

    TitleScene.prototype = new Arcadia.Scene();

    root.TitleScene = TitleScene;
}(window));
