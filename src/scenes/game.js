/*jslint this, browser */
/*global window, Arcadia, sona, PUZZLES, TUTORIALS, Grid, Cell, PuzzleSelectScene */

(function (root) {
    'use strict';

    var GameScene = function (options) {
        Arcadia.Scene.apply(this, arguments);

        options = options || {};

        Arcadia.cycleBackground();

        // TODO: change this to `puzzleIndex` or something
        this.level = options.level || 0;
        localStorage.setItem('selectedLevel', this.level);
        this.levelData = PUZZLES[this.level];
        this.showTutorial = !!TUTORIALS[this.level];
        this.tutorialStep = 0;

        this.timer = 0;
        this.VERTICAL_PADDING = 77;
        this.drawUi();

        // Puzzle grid
        this.grid = new Grid({
            data: this.levelData,
            position: {
                x: 0,
                y: this.size.height / 2 - Grid.MAX_HEIGHT / 2 - this.VERTICAL_PADDING
            }
        });
        this.add(this.grid);

        if (this.showTutorial) {
            this.displayTutorial();
        }
    };

    GameScene.prototype = new Arcadia.Scene();

    GameScene.prototype.update = function (delta) {
        Arcadia.Scene.prototype.update.call(this, delta);

        if (this.gameOver) {
            return;
        }

        this.timer += delta;

        var zeroPad = function (string, length) {
            string = String(string);
            length = parseInt(length, 10);

            while (string.length < length) {
                string = '0' + string;
            }

            return string;
        };

        var minutes = zeroPad(Math.round(this.timer / 60), 2);
        var seconds = zeroPad(Math.round(this.timer % 60), 2);

        this.timerLabel.text = 'Time\n' + minutes + ':' + seconds;

        if (this.showTutorial) {
            var square = TUTORIALS[this.level].squares[this.tutorialStep];

            var success = this.squares.find(function (s) {
                return Math.round(s.position.x) === Math.round(square.position.x) &&
                        Math.round(s.position.y) === Math.round(square.position.y) &&
                        s.area === square.area;
            });

            if (success) {
                this.tutorialStep += 1;
                this.displayTutorial();
            }
        }
    };

    GameScene.prototype.displayTutorial = function () {
        this.tutorialLabel.text = TUTORIALS[this.level].text[this.tutorialStep] || '';
        var hintInfo = TUTORIALS[this.level].hints[this.tutorialStep];
        if (hintInfo) {
            this.hint.position = hintInfo.position;
            this.hint.size = hintInfo.size;
        }
    };

    GameScene.prototype.onPointStart = function (points) {
        Arcadia.Scene.prototype.onPointStart.call(this, points);

        if (this.gameOver) {
            return;
        }

        // TODO: maybe something here?
    };

    GameScene.prototype.onPointMove = function (points) {
        Arcadia.Scene.prototype.onPointMove.call(this, points);

        if (this.gameOver) {
            return;
        }

        // TODO: maybe something here?
    };

    GameScene.prototype.onPointEnd = function (points) {
        Arcadia.Scene.prototype.onPointEnd.call(this, points);

        // This event is automatically passed down into the "grid" object

        if (this.gameOver) {
            return;
        }

        // Check if player has won
        if (this.grid.isComplete()) {
            this.win();
        }
    };

    GameScene.prototype.win = function () {
        this.gameOver = true;

        var completedPuzzles = localStorage.getObject('completedPuzzles') || [];
        while (completedPuzzles.length < PUZZLES.length) {
            completedPuzzles.push(null);
        }
        completedPuzzles[this.level] = true;
        localStorage.setObject('completedPuzzles', completedPuzzles);

        window.setTimeout(function () {
            sona.play('win');

            // Hide existing crap
            this.grid.tween('alpha', 0, 500);
            this.remove(this.hint);
            this.remove(this.tutorialLabelBackground);

            // Show new crap
            this.add(this.completeBackground);
            this.completeBackground.scale = 0;
            window.setTimeout(function () {
                this.completeBackground.tween('scale', 1, 1000, 'expoOut');
            }.bind(this), 250);
        }.bind(this), 500);
    };

    GameScene.prototype.drawUi = function () {
        var BUTTON_PADDING = 5;
        var self = this;

        var quitButton = new Arcadia.Button({
            color: null,
            border: '2px white',
            text: 'quit',
            font: '24px monospace',
            size: {width: Grid.MAX_WIDTH / 2 - BUTTON_PADDING, height: 40},
            action: function () {
                sona.play('button');
                Arcadia.changeScene(PuzzleSelectScene);
            }
        });
        quitButton.position = {
            x: -quitButton.size.width / 2 - BUTTON_PADDING,
            y: -this.size.height / 2 + quitButton.size.height / 2 + this.VERTICAL_PADDING
        };
        this.add(quitButton);

        var resetButton = new Arcadia.Button({
            color: null,
            border: '2px white',
            text: 'reset',
            font: '24px monospace',
            size: {width: Grid.MAX_WIDTH / 2 - BUTTON_PADDING, height: 40},
            action: function () {
                sona.play('erase');

                self.grid.reset();
            }
        });
        resetButton.position = {
            x: resetButton.size.width / 2 + BUTTON_PADDING,
            y: -this.size.height / 2 + resetButton.size.height / 2 + this.VERTICAL_PADDING
        };
        this.add(resetButton);

        var areaLabelBackground = new Arcadia.Shape({
            color: null,
            border: '2px white',
            size: {width: Grid.MAX_WIDTH / 2 - BUTTON_PADDING, height: 80}
        });
        areaLabelBackground.position = {
            x: -areaLabelBackground.size.width / 2 - BUTTON_PADDING,
            y: resetButton.position.y + resetButton.size.height / 2 + areaLabelBackground.size.height / 2 + BUTTON_PADDING * 2
        };
        this.add(areaLabelBackground);

        this.areaLabel = new Arcadia.Label({
            color: 'white',
            text: 'Area\n--',
            font: '28px monospace'
        });
        areaLabelBackground.add(this.areaLabel);

        var timerLabelBackground = new Arcadia.Shape({
            color: null,
            border: '2px white',
            size: {width: Grid.MAX_WIDTH / 2 - BUTTON_PADDING, height: 80}
        });
        timerLabelBackground.position = {
            x: timerLabelBackground.size.width / 2 + BUTTON_PADDING,
            y: quitButton.position.y + quitButton.size.height / 2 + timerLabelBackground.size.height / 2 + BUTTON_PADDING * 2
        };
        this.add(timerLabelBackground);

        this.timerLabel = new Arcadia.Label({
            color: 'white',
            text: 'Time\n00:00',
            font: '28px monospace'
        });
        timerLabelBackground.add(this.timerLabel);

        if (this.showTutorial) {
            this.tutorialLabelBackground = new Arcadia.Shape({
                color: null,
                border: '2px white',
                size: {width: Grid.MAX_WIDTH / 1.5, height: 110},
                position: {x: 0, y: 230}
            });
            this.add(this.tutorialLabelBackground);

            this.tutorialLabel = new Arcadia.Label({
                color: 'white',
                text: 'Tutorial text goes here\nhow much text can\nfit in this box?\na lot apparently',
                font: '20px monospace'
            });
            this.tutorialLabelBackground.add(this.tutorialLabel);

            this.hint = new Square();
            this.hint.blink();
            this.add(this.hint);
        }

        this.completeBackground = new Arcadia.Shape({
            color: null,
            border: '2px white',
            size: {width: Grid.MAX_WIDTH / 1.5, height: Grid.MAX_HEIGHT / 1.5},
            position: {x: 0, y: this.size.height / 2 - Grid.MAX_HEIGHT / 2 - this.VERTICAL_PADDING},
            enablePointEvents: true
        });

        this.completeBackground.add(new Arcadia.Label({
            font: '36px monospace',
            text: 'complete!',
            position: {x: 0, y: -75}
        }));

        this.completeBackground.add(new Arcadia.Button({
            color: null,
            border: '2px white',
            font: '36px monospace',
            text: 'next >',
            padding: 10,
            action: function () {
                sona.play('button');

                var completedPuzzles = localStorage.getObject('completedPuzzles') || [];
                var incompletePuzzleIndex = completedPuzzles.indexOf(null);

                if (incompletePuzzleIndex === -1) {
                    Arcadia.changeScene(PuzzleSelectScene);
                } else if (Arcadia.isLocked() && incompletePuzzleIndex >= Arcadia.FREE_LEVEL_COUNT) {
                    Arcadia.changeScene(UnlockScene);
                } else {
                    Arcadia.changeScene(GameScene, {level: incompletePuzzleIndex});
                }
            }
        }));

        this.completeBackground.add(new Arcadia.Button({
            color: null,
            border: '2px white',
            font: '36px monospace',
            text: '< back',
            padding: 10,
            position: {x: 0, y: 75},
            action: function () {
                sona.play('button');
                Arcadia.changeScene(PuzzleSelectScene);
            }
        }));
    };

    root.GameScene = GameScene;
}(window));
