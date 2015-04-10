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

        selected = null;
        isMoving = false;

        large = game.add.sprite(350, 350, 'large');
        medium = game.add.sprite(200, 200, 'medium');
        small = game.add.sprite(50, 50, 'small');
        large.anchor.setTo(0.5);
        medium.anchor.setTo(0.5);
        small.anchor.setTo(0.5);
        large.inputEnabled = true;
        medium.inputEnabled = true;
        small.inputEnabled = true;
        large.events.onInputDown.add(actions.select, this);
        medium.events.onInputDown.add(actions.select, this);
        small.events.onInputDown.add(actions.select, this);
        game.physics.arcade.enable(small);
        game.physics.arcade.enable(medium);
        game.physics.arcade.enable(large);
        cursors = game.input.keyboard.createCursorKeys();

        landscape.drawMap();
        cursors.left.onDown.add(actions.moveDisk,{direction: 'left'});
    },
    update: function() {
    // This function is called 60 times per second
    // It contains the game's logic

    },
};
var actions = {
    moveDisk: function(direction) {
        if (selected != null) {
            if (direction == 'left') {
                selected.body.velocity.x += -50;
            }
        }


            // (selected != null && !isMoving) {
            // // If the left arrow key is pressed
            // if (cursors.left.justPressed() ) {
            // // Move the player to the left

            //     selected.body.position.x += -50;
            // }
            // // If the right arrow key is pressed
            // else if (cursors.right.justPressed() ) {
            // // Move the player to the right

            //     selected.body.position.x += 50;
            // }
            // // If neither the right or left arrow key is pressed
            // else {
            // // Stop the player
            //     0;
            // }
        //}
    },
    select: function(disk) {
        selected = disk;
        console.log(disk);
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
var game = new Phaser.Game(1280, 600, Phaser.AUTO, 'gameDiv');
// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');
