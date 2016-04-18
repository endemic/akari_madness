/*jslint this, browser */
/*global window, Arcadia, sona, GameScene, UnlockScene, TitleScene, LEVELS,
  Thumbnail */

(function (root) {
    'use strict';

    var LevelSelectScene;

    LevelSelectScene = function (options) {
        Arcadia.Scene.call(this, options);

        options = options || {};

        var self = this;

        Arcadia.cycleBackground();

        this.selectedLevel = parseInt(localStorage.getItem('selectedLevel'), 10) || options.level || 0;
        this.perPage = 9;
        this.totalPages = Math.ceil(LEVELS.length / this.perPage);
        this.currentPage = Math.floor(this.selectedLevel / this.perPage);
        this.completedLevels = localStorage.getObject('completedLevels') || [];
        while (this.completedLevels.length < LEVELS.length) {
            this.completedLevels.push(null);
        }

        this.drawUi();
        this.updatePageLabel();

        // Create two "pages" of thumbnail previews
        this.thumbnails = [[], []];

        // Store the default coords of each thumbnail (used for resetting after animations, etc.)
        this.thumbnailPositions = [];

        this.thumbnails.forEach(function (page) {
            var thumbnail,
                thumbnailIndex,
                index,
                previewPadding = 10;

            while (page.length < self.perPage) {
                thumbnailIndex = page.length;
                index = self.currentPage * self.perPage + thumbnailIndex;

                self.thumbnailPositions[thumbnailIndex] = {
                    x: -(Thumbnail.SIZE + previewPadding) + (thumbnailIndex % 3) * (Thumbnail.SIZE + previewPadding),
                    y: -(Thumbnail.SIZE + previewPadding) + Math.floor(thumbnailIndex / 3) * (Thumbnail.SIZE + previewPadding)
                };

                thumbnail = new Thumbnail({
                    position: {
                        x: self.thumbnailPositions[thumbnailIndex].x,
                        y: self.thumbnailPositions[thumbnailIndex].y
                    }
                });

                thumbnail.drawPreview(index, self.completedLevels[index]);

                self.add(thumbnail);
                page.push(thumbnail);
            }
        });

        // Move second page offscreen
        this.thumbnails[1].forEach(function (thumbnail) {
            thumbnail.position = {
                x: thumbnail.position.x + self.size.width,
                y: thumbnail.position.y
            };
        });

        this.activeThumbnailPage = 0;

        if (this.currentPage === this.totalPages - 1) {
            this.nextButton.disabled = true;
            this.nextButton.alpha = 0.5;
        }

        if (this.currentPage === 0) {
            this.previousButton.disabled = true;
            this.previousButton.alpha = 0.5;
        }

        // Highlight the selected level thumbnail
        this.previousThumbnail = this.thumbnails[this.activeThumbnailPage][this.selectedLevel - this.currentPage * this.perPage];
        this.previousThumbnail.highlight();
    };

    LevelSelectScene.prototype = new Arcadia.Scene();

    LevelSelectScene.prototype.next = function () {
        var offset = -Arcadia.VIEWPORT_WIDTH,
            thumbnail,
            self = this;

        if (this.currentPage < this.totalPages - 1) {
            sona.play('button');
            this.nextButton.disabled = true;
            this.nextButton.alpha = 0.5;

            // Move (old) current page to the left
            this.thumbnails[this.activeThumbnailPage].forEach(function (shape, index) {
                var delay = Math.floor(index / 3) * LevelSelectScene.TRANSITION_DELAY;
                window.setTimeout(function () {
                    shape.tween('position', {x: shape.position.x + offset, y: shape.position.y}, LevelSelectScene.TRANSITION_DURATION, LevelSelectScene.TRANSITION_TYPE);
                }, delay);
            });

            // increment currentPage
            this.currentPage += 1;

            // Toggle this var between 0 and 1
            this.activeThumbnailPage = this.activeThumbnailPage === 1 ? 0 : 1;

            // Move (new) current page to the left
            this.thumbnails[this.activeThumbnailPage].forEach(function (shape, index) {
                var delay,
                    levelIndex;

                // Move offscreen to the right
                shape.position = {
                    x: self.thumbnailPositions[index].x - offset,
                    y: shape.position.y
                };

                levelIndex = self.currentPage * self.perPage + index;
                shape.drawPreview(levelIndex, self.completedLevels[levelIndex]);

                delay = Math.floor(index / 3) * LevelSelectScene.TRANSITION_DELAY + 100;

                window.setTimeout(function () {
                    shape.tween('position', {x: shape.position.x + offset, y: shape.position.y}, LevelSelectScene.TRANSITION_DURATION, LevelSelectScene.TRANSITION_TYPE);
                }, delay);
            });

            thumbnail = this.thumbnails[this.activeThumbnailPage][0];
            thumbnail.highlight();
            this.previousThumbnail.lowlight();
            this.previousThumbnail = thumbnail;
            this.selectedLevel = this.currentPage * this.perPage;
            this.updatePageLabel();
            localStorage.setItem('selectedLevel', this.selectedLevel);

            window.setTimeout(function () {
                if (self.currentPage < self.totalPages - 1) {
                    self.nextButton.disabled = false;
                    self.nextButton.alpha = 1;
                }
            }, LevelSelectScene.TOTAL_TRANSITION_DURATION);

            if (this.previousButton.alpha < 1) {
                this.previousButton.disabled = false;
                this.previousButton.alpha = 1;
            }
        }
    };

    LevelSelectScene.prototype.previous = function () {
        var offset = Arcadia.VIEWPORT_WIDTH,
            thumbnail,
            self = this;

        if (this.currentPage > 0) {
            sona.play('button');
            this.previousButton.disabled = true;
            this.previousButton.alpha = 0.5;

            // Move (old) current page to the right
            this.thumbnails[this.activeThumbnailPage].forEach(function (shape, index) {
                var delay = Math.floor((self.perPage - index - 1) / 3) * LevelSelectScene.TRANSITION_DELAY;
                window.setTimeout(function () {
                    shape.tween('position', {x: shape.position.x + offset, y: shape.position.y}, LevelSelectScene.TRANSITION_DURATION, LevelSelectScene.TRANSITION_TYPE);
                }, delay);
            });

            // decrement currentPage
            this.currentPage -= 1;

            // Toggle this var between 0 and 1
            this.activeThumbnailPage = this.activeThumbnailPage === 1 ? 0 : 1;

            // Move (new) current page to the right
            this.thumbnails[this.activeThumbnailPage].forEach(function (shape, index) {
                var delay,
                    levelIndex;

                // Move offscreen to the left
                shape.position = {
                    x: self.thumbnailPositions[index].x - offset,
                    y: shape.position.y
                };

                levelIndex = self.currentPage * self.perPage + index;
                shape.drawPreview(levelIndex, self.completedLevels[levelIndex]);

                delay = Math.floor((self.perPage - index - 1) / 3) * LevelSelectScene.TRANSITION_DELAY + 100;

                window.setTimeout(function () {
                    shape.tween('position', {x: shape.position.x + offset, y: shape.position.y}, LevelSelectScene.TRANSITION_DURATION, LevelSelectScene.TRANSITION_TYPE);
                }, delay);
            });

            thumbnail = this.thumbnails[this.activeThumbnailPage][0];
            thumbnail.highlight();
            this.previousThumbnail.lowlight();
            this.previousThumbnail = thumbnail;
            this.selectedLevel = this.currentPage * this.perPage;
            this.updatePageLabel();
            localStorage.setItem('selectedLevel', this.selectedLevel);

            window.setTimeout(function () {
                if (self.currentPage > 0) {
                    self.previousButton.disabled = false;
                    self.previousButton.alpha = 1;
                }
            }, LevelSelectScene.TOTAL_TRANSITION_DURATION);

            if (this.nextButton.alpha < 1) {
                this.nextButton.disabled = false;
                this.nextButton.alpha = 1;
            }
        }
    };

    LevelSelectScene.prototype.updatePageLabel = function () {
        this.pageLabel.text = 'Page ' + (this.currentPage + 1) + ' of ' + this.totalPages;
        this.puzzleLabel.text = 'Puzzle #' + (this.selectedLevel + 1);
        // this.difficultyLabel.text = 'Difficulty: ' + LEVELS[this.selectedLevel].difficulty;
        this.difficultyLabel.text = 'Size: ' + LEVELS[this.selectedLevel].size + 'x' + LEVELS[this.selectedLevel].size;
        this.completedLabel.text = 'Completed? ' + (this.completedLevels[this.selectedLevel] ? '✓' : '✗');
    };

    LevelSelectScene.prototype.onPointEnd = function (points) {
        Arcadia.Scene.prototype.onPointEnd.call(this, points);
        var self = this,
            cursor = {
                size: {width: 1, height: 1},
                position: points[0]
            };

        // Determine if tap/click touched a thumbnail
        this.thumbnails[this.activeThumbnailPage].forEach(function (thumbnail, index) {
            if (thumbnail.collidesWith(cursor) && thumbnail.alpha === 1) {
                sona.play('button');

                self.previousThumbnail.lowlight();
                thumbnail.highlight();
                self.previousThumbnail = thumbnail;
                self.selectedLevel = self.currentPage * self.perPage + index;
                localStorage.setItem('selectedLevel', self.selectedLevel);
                self.updatePageLabel();
            }
        });
    };

    LevelSelectScene.prototype.drawUi = function () {
        var self = this;

        this.pageLabel = new Arcadia.Label({
            position: {x: 0, y: -145},
            font: '20px monospace'
        });
        this.add(this.pageLabel);

        this.puzzleLabel = new Arcadia.Label({
            position: {x: 0, y: 160},
            font: '24px monospace'
        });
        this.add(this.puzzleLabel);

        this.difficultyLabel = new Arcadia.Label({
            position: {x: 0, y: 190},
            font: '24px monospace'
        });
        this.add(this.difficultyLabel);

        this.completedLabel = new Arcadia.Label({
            position: {x: 0, y: 220},
            font: '24px monospace'
        });
        this.add(this.completedLabel);

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

        if (Arcadia.ENV.cordova && Arcadia.isLocked()) {
            var unlockButton = new Arcadia.Button({
                position: {x: this.size.width / 2 - 65, y: -this.size.height / 2 + 25},
                size: {width: 120, height: 40},
                color: null,
                border: '2px white',
                text: 'unlock',
                font: '24px monospace',
                action: function () {
                    sona.play('button');
                    Arcadia.changeScene(UnlockScene);
                }
            });
            this.add(unlockButton);
        }

        var title = new Arcadia.Label({
            text: 'choose\npuzzle',
            font: '48px monospace',
            position: {x: 0, y: -this.size.height / 2 + 110}
        });
        this.add(title);

        var playButton = new Arcadia.Button({
            position: {x: 0, y: this.size.height / 2 - 50},
            size: {width: 180, height: 50},
            color: null,
            border: '2px white',
            text: 'play',
            font: '36px monospace',
            action: function () {
                sona.play('button');
                if (Arcadia.isLocked() && self.selectedLevel >= Arcadia.FREE_LEVEL_COUNT) {
                    Arcadia.changeScene(UnlockScene);
                } else {
                    Arcadia.changeScene(GameScene, {level: self.selectedLevel});
                }
            }
        });
        this.add(playButton);

        // Create previous/next buttons
        this.previousButton = new Arcadia.Button({
            position: {x: -this.size.width / 2 + 30, y: 0},
            size: {width: 50, height: 50},
            border: '2px white',
            color: null,
            vertices: 0,
            label: new Arcadia.Label({
                text: '<',
                font: '40px monospace'
            }),
            action: function () {
                self.previous();
            }
        });

        this.nextButton = new Arcadia.Button({
            position: {x: this.size.width / 2 - 30, y: 0},
            size: {width: 50, height: 50},
            border: '2px white',
            color: null,
            vertices: 0,
            label: new Arcadia.Label({
                text: '>',
                font: '40px monospace'
            }),
            action: function () {
                self.next();
            }
        });

        this.add(this.previousButton);
        this.add(this.nextButton);
    };

    LevelSelectScene.TRANSITION_TYPE = 'cubicInOut';
    LevelSelectScene.TRANSITION_DURATION = 400;
    LevelSelectScene.TRANSITION_DELAY = 100;
    LevelSelectScene.TOTAL_TRANSITION_DURATION = 600;

    root.LevelSelectScene = LevelSelectScene;
}(window));
