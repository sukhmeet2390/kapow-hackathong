"use strict";

import kapowWrapper from "../kapow/KapowWrapper"
import CharacterChosen from "../model/CharacterChosen";
import MoveData from "../model/MoveData";
import * as PhaserUi from "phaser-ui";

class Lobby extends Phaser.State {
    preload() {
        console.log("Lobby Preload");
        this.slider = new phaseSlider(this.game);
    }

    sendChoices(chosenCharacter) {
        var self = this;
        kapowWrapper.getUserInfo(function(user) {
            var chooserId = user.player.id;
            var characterChosen = new CharacterChosen(chosenCharacter, chooserId);
            kapowWrapper.getRoomInfo(function(room) {
                var opponentId = null;
                for (var i = 0; i < 2; i++) {
                    if (room.players[i].id !== chooserId) {
                        opponentId = room.players[i].id;
                    }
                }

                console.log("Chooser : " + chooserId);
                console.log("Character chosen : " + characterChosen);


                kapowWrapper.callOnServer('sendTurn', new MoveData(characterChosen, chooserId, chooserId),
                    function() {
                        console.log("Character choose turn sent!");
                        self.game.state.start("Arena");
                    },
                    function(error) {
                        console.log("Error in sendTurn: " + error);
                });
            });
        });
    }

    create() {
        let block1 = this.game.add.image(0, 0, "block1");
        let block2 = this.game.add.image(0, 0, "block2");

        this.slider.createSlider({
            customSliderBG: false,
            mode: "horizontal",
            sliderBGAlpha: 0.5,
            width: this.game.width,
            height: this.game.height,
            x: 0,
            y: 0,
            objects: [block1, block2]
        });
        this.slider.removeItemAt(0);
        console.log(this.slider);


        this.btn = this.game.add.image(784, 892, "play");
        this.btn.inputEnabled = true;

        var self = this;
        this.btn.events.onInputDown.add(function (e, pointer) {
            self.btn.inputEnabled = false;
            var index = self.slider.getCurrentIndex();
            console.log("Selected char ", index);
            self.onClick(index);
        });
    }
    onClick(index) {
        console.log("Play with friends clicked!");
        var self = this;
        kapowWrapper.startGameWithFriends(function () {
                console.log("Starting game with friends!");
                self.sendChoices(index);
            },
            function (error) {
                self.btn.inputEnabled = true;
                console.log(error);
            });
    }

    _handleBackButton() {
        console.log("Back button inside Lobby!");
        this.game.state.start("Menu");
    }

    update() {
    }
}

export default Lobby;