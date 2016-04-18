/*jslint this, browser */
/*global window, Arcadia, sona, TitleScene, LEVELS */

(function (root) {
    'use strict';

    var AboutScene = function () {
        Arcadia.Scene.apply(this);

        Arcadia.cycleBackground();

        var BUTTON_MARGIN = 65;

        var title = new Arcadia.Label({
            text: 'about',
            font: '64px monospace',
            position: {x: 0, y: -200}
        });
        this.add(title);

        var backButton = new Arcadia.Button({
            position: {x: -this.size.width / 2 + 65, y: -this.size.height / 2 + 25},
            size: {width: 120, height: 40},
            color: null,
            border: '2px white',
            text: '< title',
            font: '24px monospace',
            action: function () {
                sona.play('button');
                Arcadia.changeScene(TitleScene);
            }
        });
        this.add(backButton);

        var creditsText = [
            'Programming by Nathan Demick',
            'Puzzle concept by Nikoli',
            '(c) 2011-2016 Ganbaru Games',
            'https://ganbarugames.com'
        ];

        var detailLabel = new Arcadia.Label({
            text: creditsText.join('\n'),
            font: '20px monospace',
            position: {x: 0, y: -75}
        });
        this.add(detailLabel);

        /* Lawl not actually checking that localstorage bool */
        // var sfxToggleButton = new Arcadia.Button({
        //     position: { x: 0, y: 50 },
            // size: {width: 180, height: 50},
            // color: null,
            // border: '2px white',
            // text: (localStorage.getBoolean('playSfx') ? 'Sound on' : 'Sound off'),
            // font: '36px monospace',
        //     action: function () {
        //         sona.play('button');

        //         if (localStorage.getBoolean('playSfx')) {
        //             localStorage.setBoolean('playSfx', false);
        //             this.text = 'Sound off';
        //         } else {
        //             localStorage.setBoolean('playSfx', true);
        //             this.text = 'Sound on';
        //         }
        //     }
        // });
        // this.add(sfxToggleButton);

        var dataResetButton = new Arcadia.Button({
            // position: { x: 0, y: sfxToggleButton.position.y + 60 },
            position: {x: 0, y: 60},
            size: {width: 240, height: 50},
            color: null,
            border: '2px white',
            text: 'reset data',
            font: '36px monospace',
            action: function () {
                sona.play('button');

                if (window.confirm('Reset all saved data?')) {
                    var completedLevels = [];
                    while (completedLevels.length < LEVELS.length) {
                        completedLevels.push(null);
                    }
                    localStorage.setObject('completedLevels', completedLevels);
                }
            }
        });
        this.add(dataResetButton);

        if (Arcadia.ENV.cordova) {
            var rateButton = new Arcadia.Button({
                position: {x: 0, y: dataResetButton.position.y + BUTTON_MARGIN},
                size: {width: 240, height: 50},
                color: null,
                border: '2px white',
                text: 'feedback',
                font: '36px monospace',
                action: function () {
                    window.sona.play('button');
                    window.open('itms-apps://itunes.apple.com/app/id1067169429');
                }
            });
            this.add(rateButton);

            var moreGamesButton = new Arcadia.Button({
                position: {x: 0, y: rateButton.position.y + BUTTON_MARGIN},
                size: {width: 240, height: 50},
                color: null,
                border: '2px white',
                text: 'more games',
                font: '36px monospace',
                action: function () {
                    window.sona.play('button');
                    window.open('itms-apps://itunes.com/apps/ganbarugames');
                }
            });
            this.add(moreGamesButton);
        }
    };

    AboutScene.prototype = new Arcadia.Scene();

    root.AboutScene = AboutScene;
}(window));
