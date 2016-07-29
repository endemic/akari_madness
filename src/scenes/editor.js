/*jslint this, browser */
/*global window, Arcadia, sona, TitleScene, Square, Grid, Clue */

(function (root) {
    'use strict';

    var EditorScene = function (options) {
        Arcadia.Scene.apply(this);
        Arcadia.cycleBackground();

        options = options || {};

        var data;

        if (options.puzzleIndex) {
            data = PUZZLES[options.puzzleIndex];
        }

        this.verticalPadding = 70;
        this.grid = new Grid({
            data: data,
            position: {
                x: 0,
                y: this.size.height / 2 - Grid.MAX_HEIGHT / 2 - this.verticalPadding
            }
        });
        this.add(this.grid);

        this.drawUi();
    };

    EditorScene.prototype = new Arcadia.Scene();

    EditorScene.prototype.save = function () {
        /*
            Puzzle data format: {
                size: 8,
                hints: [
                    {position: {x: 5, y: 0}, number: 1},
                    {position: {x: 1, y: 1}, number: 3},
                    {position: {x: 2, y: 1}, number: null}
                ]
            };
        */

        var puzzles = localStorage.getObject('puzzles') || [];
        var self = this;
        var data = {
            size: this.grid.data.size,
            hints: []
        };

        this.grid.cells.forEach(function (cell, index) {
            var size = this.grid.data.size;

            if (index >= Math.pow(size, 2) || cell.status !== Cell.STATUS.HINT) {
                return;
            }

            // Cell coordinates are stored with origin at top left
            var row = Math.floor(index / size);
            var column = index % size;
            var number = cell.number;

            data.hints.push({position: {x: column, y: row}, number: number});
        }.bind(this));

        // debugger;
        puzzles.push(data);
        localStorage.setObject('puzzles', puzzles);
        console.log(JSON.stringify(data));
    };

    EditorScene.prototype.drawUi = function () {
        var padding = 10;
        var buttonWidth = Grid.MAX_WIDTH / 2 - padding;
        var buttonHeight = 40;
        var self = this;

        var smallerButton = new Arcadia.Button({
            color: null,
            border: '3px white',
            label: new Arcadia.Label({
                text: 'smaller',
                font: '24px monospace'
            }),
            size: {width: buttonWidth, height: buttonHeight},
            position: {
                x: buttonWidth / 2 + padding / 2,
                y: -this.size.height / 2 + buttonHeight / 2 + this.verticalPadding
            },
            action: function () {
                sona.play('button');

                var size = this.grid.data.size;
                if (size > Grid.MIN_SIZE) {
                    size -= 1;
                    this.grid.resize(size);
                }
            }.bind(this)
        });
        this.add(smallerButton);

        var biggerButton = new Arcadia.Button({
            color: null,
            border: '3px white',
            label: new Arcadia.Label({
                text: 'bigger',
                font: '24px monospace'
            }),
            size: {width: buttonWidth, height: buttonHeight},
            position: {
                x: -buttonWidth / 2 - padding / 2,
                y: -this.size.height / 2 + buttonHeight / 2 + this.verticalPadding
            },
            action: function () {
                sona.play('button');

                var size = this.grid.data.size;
                if (size < Grid.MAX_SIZE) {
                    size += 1;
                    this.grid.resize(size);
                }
            }.bind(this)
        });
        this.add(biggerButton);

        var playButton = new Arcadia.Button({
            color: null,
            border: '3px white',
            label: new Arcadia.Label({
                text: 'play',
                font: '24px monospace'
            }),
            size: {width: buttonWidth, height: buttonHeight},
            position: {
                x: buttonWidth / 2 + padding / 2,
                y: smallerButton.position.y + smallerButton.size.height + padding
            },
            action: function () {
                sona.play('button');
                // Change action to place lights; normal gameplay
                // TODO: highlight button in some way
                this.grid.mode = Grid.MODES.PLAY;
            }.bind(this)
        });
        this.add(playButton);

        var editButton = new Arcadia.Button({
            color: null,
            border: '3px white',
            label: new Arcadia.Label({
                text: 'edit',
                font: '24px monospace'
            }),
            size: {width: buttonWidth, height: buttonHeight},
            position: {
                x: -buttonWidth / 2 - padding / 2,
                y: biggerButton.position.y + biggerButton.size.height + padding
            },
            action: function () {
                sona.play('button');
                // Change action to place hints; puzzle editor
                // TODO: highlight button in some way
                this.grid.mode = Grid.MODES.EDIT;
            }.bind(this)
        });
        this.add(editButton);

        var quitButton = new Arcadia.Button({
            color: null,
            border: '3px white',
            label: new Arcadia.Label({
                text: 'quit',
                font: '24px monospace'
            }),
            size: {width: buttonWidth, height: buttonHeight},
            position: {
                x: buttonWidth / 2 + padding / 2,
                y: playButton.position.y + playButton.size.height + padding
            },
            action: function () {
                sona.play('button');
                Arcadia.changeScene(PuzzleSelectScene);
            }
        });
        this.add(quitButton);

        var saveButton = new Arcadia.Button({
            color: null,
            border: '3px white',
            label: new Arcadia.Label({
                text: 'save',
                font: '24px monospace'
            }),
            size: {width: buttonWidth, height: buttonHeight},
            position: {
                x: -buttonWidth / 2 - padding / 2,
                y: editButton.position.y + editButton.size.height + padding
            },
            action: function () {
                sona.play('button');
                this.save();
            }.bind(this)
        });
        this.add(saveButton);
    };

    root.EditorScene = EditorScene;
}(window));
