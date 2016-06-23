/*jslint this, browser */
/*global window, Arcadia, sona, LEVELS, TUTORIALS, Grid, Cell, LevelSelectScene */

(function (root) {
    'use strict';

    var GameScene = function (options) {
        Arcadia.Scene.apply(this, arguments);

        options = options || {};

        Arcadia.cycleBackground();
        this.color = 'wheat';

        this.level = options.level || 0;
        localStorage.setItem('selectedLevel', this.level);
        this.levelData = LEVELS[this.level];
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
                y: this.size.height / 2 - Grid.MAX_SIZE / 2 - this.VERTICAL_PADDING
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

        var completedLevels = localStorage.getObject('completedLevels') || [];
        while (completedLevels.length < LEVELS.length) {
            completedLevels.push(null);
        }
        completedLevels[this.level] = true;
        localStorage.setObject('completedLevels', completedLevels);

        var self = this;

        window.setTimeout(function () {
            // sona.play('win');
            alert('u win, bro');

            // Hide existing crap
            self.grid.tween('alpha', 0, 500);
            self.clues.forEach(function (clue) {
                clue.tween('alpha', 0, 500);
            });
            self.squares.forEach(function (square) {
                square.tween('alpha', 0, 500);
            });
            self.remove(self.hint);
            self.remove(self.tutorialLabelBackground);

            // Show new crap
            self.add(self.completeBackground);
            self.completeBackground.scale = 0;
            window.setTimeout(function () {
                self.completeBackground.tween('scale', 1, 1000, 'expoOut');
            }, 250);
        }, 500);
    };

    GameScene.prototype.drawUi = function () {
        var BUTTON_PADDING = 5;
        var self = this;

        var quitButton = new Arcadia.Button({
            color: null,
            border: '2px white',
            text: 'quit',
            font: '24px monospace',
            size: {width: Grid.MAX_SIZE / 2 - BUTTON_PADDING, height: 40},
            action: function () {
                sona.play('button');
                Arcadia.changeScene(LevelSelectScene);
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
            size: {width: Grid.MAX_SIZE / 2 - BUTTON_PADDING, height: 40},
            action: function () {
                sona.play('erase');

                self.squares.forEach(function (square) {
                    self.remove(square);
                });
                self.squares = [];
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
            size: {width: Grid.MAX_SIZE / 2 - BUTTON_PADDING, height: 80}
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
            size: {width: Grid.MAX_SIZE / 2 - BUTTON_PADDING, height: 80}
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
                size: {width: Grid.MAX_SIZE / 1.5, height: 110},
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
            size: {width: Grid.MAX_SIZE / 1.5, height: Grid.MAX_SIZE / 1.5},
            position: {x: 0, y: this.size.height / 2 - Grid.MAX_SIZE / 2 - this.VERTICAL_PADDING},
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

                var completedLevels = localStorage.getObject('completedLevels') || [];
                var incompleteLevel = completedLevels.indexOf(null);

                if (incompleteLevel === -1) {
                    Arcadia.changeScene(LevelSelectScene);
                } else if (Arcadia.isLocked() && incompleteLevel >= Arcadia.FREE_LEVEL_COUNT) {
                    Arcadia.changeScene(UnlockScene);
                } else {
                    Arcadia.changeScene(GameScene, {level: incompleteLevel});
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
                Arcadia.changeScene(LevelSelectScene);
            }
        }));
    };

    root.GameScene = GameScene;
}(window));
