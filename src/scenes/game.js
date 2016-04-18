/*jslint this, browser */
/*global window, Arcadia, sona, LEVELS, TUTORIALS, Grid, Square, Clue,
LevelSelectScene, UnlockScene */

(function (root) {
    'use strict';

    var GameScene = function (options) {
        Arcadia.Scene.apply(this, arguments);

        options = options || {};

        Arcadia.cycleBackground();

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
            size: this.levelData.size,
            position: {
                x: 0,
                y: this.size.height / 2 - Grid.MAX_SIZE / 2 - this.VERTICAL_PADDING
            }
        });
        this.add(this.grid);

        // Clues
        this.clues = [];
        this.drawClues();

        // Squares
        this.squares = [];
        this.activeSquare = new Square({
            alpha: 0
        });
        this.add(this.activeSquare);

        if (this.showTutorial) {
            this.displayTutorial();
        }

        // DEBUG
        // var self = this;
        // window.setTimeout(function () {
        //     self.win();
        // }, 1000);
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

        var self = this;
        var values = this.grid.getRowAndColumn(points[0]);
        var row = values[0];
        var column = values[1];

        if (row === null || column === null) {
            return;
        }

        this.startPoint = points[0];
        this.startRow = row;
        this.previousRow = row;
        this.startColumn = column;
        this.previousColumn = column;

        this.activeSquare.position = {
            x: this.grid.bounds.left + column * this.grid.cellSize + this.grid.cellSize / 2,
            y: this.grid.bounds.top + row * this.grid.cellSize + this.grid.cellSize / 2
        };

        // Make slightly smaller; was causing erroneous collisions
        this.activeSquare.size = {
            width: this.grid.cellSize - 1,
            height: this.grid.cellSize - 1
        };

        // Determine if the square collides with another;
        // if so, delete the old one
        this.squares.forEach(function (square, index) {
            if (self.activeSquare.collidesWith(square)) {
                square.tween('scale', 1.3, 250);
                square.tween('alpha', 0, 250, 'linearNone', function () {
                    self.remove(square);
                    self.squares.splice(index, 1);
                });
                sona.play('erase');
            }
        });
    };

    GameScene.prototype.onPointMove = function (points) {
        Arcadia.Scene.prototype.onPointMove.call(this, points);

        if (this.gameOver) {
            return;
        }

        if (this.startRow === null || this.startColumn === null) {
            return;
        }

        var values = this.grid.getRowAndColumn(points[0]);
        var row = values[0];
        var column = values[1];

        if (row === null || column === null) {
            return;
        }

        // This allows a single click/tap to remove squares
        // Player has to move input at least 5px to start drawing a new one
        if (Arcadia.distance(points[0], this.startPoint) > 5 && this.activeSquare.alpha === 0) {
            this.activeSquare.alpha = 1;
            this.areaLabel.text = 'Area\n1';
            sona.play('move');
        }

        var width = Math.abs(this.startColumn - column) + 1;
        var height = Math.abs(this.startRow - row) + 1;

        // Set position
        this.activeSquare.position = {
            x: this.grid.bounds.left + ((width / 2 + this.startColumn) * this.grid.cellSize),
            y: this.grid.bounds.top + ((height / 2 + this.startRow) * this.grid.cellSize)
        };

        // Change size if necessary
        if (row !== this.previousRow) {
            this.activeSquare.size = {
                width: this.activeSquare.size.width,
                height: height * this.grid.cellSize
            };
        }

        // Offset position if necessary
        if (row < this.startRow) {
            this.activeSquare.position = {
                x: this.activeSquare.position.x,
                y: this.activeSquare.position.y - ((this.startRow - row) * this.grid.cellSize)
            };
        }

        // Change size if necessary
        if (column !== this.previousColumn) {
            this.activeSquare.size = {
                width: width * this.grid.cellSize,
                height: this.activeSquare.size.height
            };
        }

        // Offset position if necessary
        if (column < this.startColumn) {
            this.activeSquare.position = {
                x: this.activeSquare.position.x - ((this.startColumn - column) * this.grid.cellSize),
                y: this.activeSquare.position.y
            };
        }

        if (row !== this.previousRow || column !== this.previousColumn) {
            this.areaLabel.text = 'Area\n' + (width * height);
            sona.play('move');
        }

        this.previousRow = row;
        this.previousColumn = column;
    };

    GameScene.prototype.onPointEnd = function (points) {
        Arcadia.Scene.prototype.onPointEnd.call(this, points);

        if (this.gameOver) {
            return;
        }

        if (this.activeSquare.alpha === 1) {
            var width = Math.abs(this.startColumn - this.previousColumn) + 1;
            var height = Math.abs(this.startRow - this.previousRow) + 1;
            var area = width * height;

            // Dupe the activeSquare
            var dupe = new Square({
                position: {
                    x: this.activeSquare.position.x,
                    y: this.activeSquare.position.y
                },
                size: {
                    width: this.activeSquare.size.width,
                    height: this.activeSquare.size.height
                },
                area: area,  // non-standard prop
                scale: 1.25,
                alpha: 0
            });

            this.add(dupe);
            this.squares.push(dupe);

            dupe.tween('scale', 1, 300);
            dupe.tween('alpha', 1, 300);

            sona.play('place');

            // Check if square overlaps a clue
            // If square overlaps a single clue, check if the area matches the clue
            // If area matches the single clue, give the square a different color

            // Reset the activeSquare
            this.activeSquare.alpha = 0;
        }

        // Check if player has won
        if (this.check()) {
            this.win();
        }

        // Clear out previous data
        this.startRow = null;
        this.previousRow = null;
        this.startColumn = null;
        this.previousColumn = null;
        this.areaLabel.text = 'Area\n--';
    };

    GameScene.prototype.check = function () {
        var self = this;

        if (this.squares.length !== this.clues.length) {
            // console.log('Square count doesn\'t match clue count');
            return false;
        }

        var success = true;

        this.squares.forEach(function (square) {
            var collisionCount = 0;
            var validClue = null;

            self.clues.forEach(function (clue) {
                if (clue.collidesWith(square)) {
                    validClue = clue;
                    collisionCount += 1;
                }
            });

            if (collisionCount > 1 || collisionCount === 0) {
                // console.log("Failing because a clue has either no squares covering it, or multiple squares covering it");
                success = false;
            } else if (validClue.number !== square.area) {
                // console.log("Clue (" + validClue.number + ") and Square area (" + square.area + ") don't match!");
                success = false;
            }
        });

        return success;
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
            sona.play('win');

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

    GameScene.prototype.drawClues = function () {
        var self = this;

        this.levelData.clues.forEach(function (clue) {
            var x = clue[0];
            var y = clue[1];
            var value = clue[2];
            var CLUE_OFFSET = 2;

            var clueLabel = new Clue({
                number: value,
                position: {
                    x: self.grid.bounds.left + (x * self.grid.cellSize) + Clue.SIZE / 2 + CLUE_OFFSET,
                    y: self.grid.bounds.top + (y * self.grid.cellSize) + Clue.SIZE / 2 + CLUE_OFFSET
                }
            });
            self.add(clueLabel);
            self.clues.push(clueLabel);
        });
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
