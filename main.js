// We create our only state
var mainState = {
// Here we add all the functions we need for our state
// For this project we will just have 3 functions
    preload: function() {
    // This function will be executed at the beginning
    // That's where we load the game's assets
    // Load the images
        game.load.image('small', 'blueHigh2.png');
        game.load.image('medium', 'blueHigh4.png');
        game.load.image('large', 'blueHigh6.png');
        game.stage.backgroundColor = '#7FDBFF';
        game.physics.startSystem(Phaser.Physics.ARCADE);
    },
    create: function() {
    // This function is called after the preload function
    // Here we set up the game, display sprites, etc.
        landscape.initMap();

        large = game.add.sprite(350, 350, 'large');
        medium = game.add.sprite(200, 200, 'medium');
        small = game.add.sprite(50, 50, 'small');
        large.anchor.setTo(0.5, 0.5);
        medium.anchor.setTo(0.5, 0.5);
        small.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(small);
        game.physics.arcade.enable(medium);
        game.physics.arcade.enable(large);
        cursors = game.input.keyboard.createCursorKeys();

        landscape.drawMap();
    },
    update: function() {
    // This function is called 60 times per second
    // It contains the game's logic
        actions.movePlayer();
    },
};
var actions = {
    movePlayer: function() {

        // If the left arrow key is pressed
        if (cursors.left.isDown) {
        // Move the player to the left
            small.body.velocity.x = -200;
        }
        // If the right arrow key is pressed
        else if (cursors.right.isDown) {
        // Move the player to the right
            small.body.velocity.x = 200;
        }
        // If neither the right or left arrow key is pressed
        else {
        // Stop the player
            small.body.velocity.x = 0;
        }
    }
};

var landscape = {
    initMap: function() {
        map = [];
        for (var x = 0; x < 3; x++) {
            var newTower = [];
            for (var y = 0; y < 4; y++){
                newTower.push('.');
            }
            map.push(newTower);
        }
        map[0][0] = "L";
        map[0][1] = "M";
        map[0][2] = "S";
    },

    drawMap: function() {
        0;
    }
}

// We initialising Phaser
var game = new Phaser.Game(1200, 600, Phaser.AUTO, 'gameDiv');
// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');
