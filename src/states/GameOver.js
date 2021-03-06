import KapowWrapper from "../kapow/KapowWrapper";

class GameOver extends Phaser.State {

    preload() {

    }

    init(text) {
        console.log("Text : " + text);
        if (!text) {
            this.text = "Come, play this new addictive game!";
        }
        else if (text === "Win") {
            this.win = true;
            this.text = "I just won fair and square on this new addictive game!";
        }
        else {
            this.win = false;
            this.text = "Come, play this new addictive game!";
        }
    }

    create() {
        this.shareBackground = this.game.add.image(0, 0, 'share-bg');
        let fbShare = this.game.add.button(850, 690, 'fbShare', this._handleFbClick, this, 2, 1, 0);
        let tweetShare = this.game.add.button(980, 690, 'tweetShare', this._handleTweetClick, this, 2, 1, 0);
        this.game.add.button(820, 572, 'replay', this.restartGame, this, 2, 1, 0);

        console.log("Game over screen!");
        if (this.win) {
            this.game.add.image(597, 366, 'win');
        } else {
            this.game.add.image(597, 366, 'lose');
        }

    }

    restartGame() {
        var self = this;
        kapow.unloadRoom(function() {
            console.log("Successfully unloaded room!");
            self.game.state.start("Lobby");
        });
    }

    _handleFbClick() {
        console.log("FB Share");
        KapowWrapper.share(this.text, 'facebook', function () {
            console.log('Fb Share successful');
        });
    }

    _handleTweetClick() {
        console.log("Tweet Share");
        KapowWrapper.share(this.text, 'twitter', function () {
            console.log('Tweet Share successful');
        });
    }

    _handleBackButton() {
        console.log("Back button inside game over!");
        kapow.unloadRoom(function() {
            console.log("Unloaded room");
            kapow.close();
        });
    }
}

export default GameOver;
