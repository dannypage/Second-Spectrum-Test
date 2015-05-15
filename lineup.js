var mainState = {
    preload: function() {
    // Load all of the images
        game.load.image('pitch', './lineup/football-pitch-template-powerpoint_2.jpg');
        game.stage.backgroundColor = '#7FDBFF';
    },
    create: function() {
        pitch = game.add.sprite(0, 0, 'pitch');

        players = game.add.group();
        players.createMultiple(11);


        var text = game.add.text(game.world.centerX, 200, "Crystal Dunn", { font: "65px Arial", fill: "#ffffff", align: "center" });
    },
    update: function() {

    },
};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');
