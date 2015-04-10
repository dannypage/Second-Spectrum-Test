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
        free = false;

        large = game.add.sprite(200, 500, 'large');
        medium = game.add.sprite(200, 400, 'medium');
        small = game.add.sprite(200, 300, 'small');
        large.anchor.setTo(0.5);
        medium.anchor.setTo(0.5);
        small.anchor.setTo(0.5);
        large.inputEnabled = true;
        medium.inputEnabled = true;
        small.inputEnabled = true;
        large.pos = 0
        medium.pos = 1
        small.pos = 2
        map[0][0] = large;
        map[0][1] = medium;
        map[0][2] = small;
        large.events.onInputDown.add(actions.select, this);
        medium.events.onInputDown.add(actions.select, this);
        small.events.onInputDown.add(actions.select, this);
        game.physics.arcade.enable(small);
        game.physics.arcade.enable(medium);
        game.physics.arcade.enable(large);

        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function () { actions.moveDisk('up'); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function () { actions.moveDisk('down'); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function () { actions.moveDisk('left'); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function () { actions.moveDisk('right'); }, this);
        landscape.drawMap();
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
                selected.x += -50;
            } else if (direction == 'right') {
                selected.x += 50;
            } else if (direction == 'up') {
                selected.y += -50;
            } else if (direction == 'down') {
                selected.y += 50;
            }
        }
    },
    select: function(disk) {
        if (!free) {
            if (selected != null){
                selected.tint = 0xffffff;
            }
            selected = disk;
            selected.tint = 0xbbbbbb;
        }
    }
};

var landscape = {
    initMap: function() {
        map = [];
        for (var x = 0; x < 3; x++) {
            var newTower = [];
            for (var y = 0; y < 4; y++){
                newTower.push(null);
            }
            map.push(newTower);
        }
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
