/*jslint this, browser */
/*global Arcadia, window, console, CreditsScene, LevelSelectScene */

(function (root) {
    'use strict';

    var UnlockScene;

    UnlockScene = function () {
        Arcadia.Scene.apply(this, arguments);

        Arcadia.cycleBackground();

        // Should never occur; for testing on desktop only
        if (window.PRODUCT_DATA === undefined) {
            window.PRODUCT_DATA = {price: '$999'};
        }

        var BUTTON_PADDING = 15;

        var description = new Arcadia.Label({
            position: {x: 0, y: -100},
            font: '20px monospace',
            text: 'I hope you\'ve enjoyed\nsolving puzzles so far.\nWould you like to\nunlock 115 more puzzles\nfor only ' + window.PRODUCT_DATA.price + '?'
        });
        this.add(description);

        /* Buttons */

        var yesButton = new Arcadia.Button({
            position: {x: 0, y: 75},
            color: null,
            border: '2px #fff',
            padding: BUTTON_PADDING,
            text: 'yes, please',
            font: '20px monospace',
            action: function () {
                window.sona.play('button');
                window.store.order(UnlockScene.PRODUCT_ID);
            }
        });
        this.add(yesButton);

        var noButton = new Arcadia.Button({
            position: {x: 0, y: 150},
            color: null,
            border: '2px #fff',
            padding: BUTTON_PADDING,
            text: 'no, thanks',
            font: '20px monospace',
            action: function () {
                window.sona.play('button');
                Arcadia.changeScene(CreditsScene);
            }
        });
        this.add(noButton);

        var restoreButton = new Arcadia.Button({
            position: {x: 0, y: 225},
            color: null,
            border: '2px #fff',
            padding: BUTTON_PADDING,
            text: 'restore purchase',
            font: '20px monospace',
            action: function () {
                window.sona.play('button');

                if (window.store.restore) {
                    window.store.restore();
                } else {
                    window.store.order(UnlockScene.PRODUCT_ID);
                }
            }
        });
        this.add(restoreButton);
    };

    UnlockScene.prototype = new Arcadia.Scene();

    UnlockScene.PRODUCT_ID = 'com.ganbarugames.shikaku.unlock';

    UnlockScene.initializeStore = function () {
        if (window.store === undefined) {
            return;
        }

        // Let's set a pretty high verbosity level, so that we see a lot of stuff
        // in the console (reassuring us that something is happening).
        window.store.verbosity = window.store.INFO;

        // We register a dummy product. It's ok, it shouldn't
        // prevent the store "ready" event from firing.
        window.store.register({
            id: UnlockScene.PRODUCT_ID,
            alias: 'Unlock all puzzles',
            type: window.store.NON_CONSUMABLE
        });


        window.store.when('Unlock all puzzles').updated(function (p) {
            // p = { id, price, loaded, valid, canPurchase }
            window.PRODUCT_DATA = p;
        });

        // When purchase of the full version is approved,
        // show some logs and finish the transaction.
        window.store.when('Unlock all puzzles').approved(function (order) {
            // console.log('Unlock all puzzles approved');

            localStorage.setBoolean('unlocked', true);
            order.finish();

            Arcadia.changeScene(LevelSelectScene);
        });

        // When every goes as expected, it's time to celebrate!
        window.store.ready(function () {
            console.log("*** STORE READY ***");
        });

        // After we've done our setup, we tell the store to do
        // it's first refresh. Nothing will happen if we do not call store.refresh()
        window.store.refresh();
    };

    root.UnlockScene = UnlockScene;
}(window));
