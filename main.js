// We create our only state
var mainState = {
// Here we add all the functions we need for our state
// For this project we will just have 3 functions
    preload: function() {
    // This function will be executed at the beginning
    // That's where we load the game's assets
    // Load the images
        game.load.image('small', '/assets/blueHigh2.png');
        game.load.image('medium', '/assets/blueHigh4.png');
        game.load.image('large', '/assets/blueHigh6.png');
        game.load.image('red', '/assets/red6.png');
        game.load.image('reload', '/assets/return.png')
        game.stage.backgroundColor = '#7FDBFF';
    },
    create: function() {
    // This function is called after the preload function
    // Here we set up the game, display sprites, etc.

        selected = null;
        moving = false;

        landscape.createBlocks();
        large = game.add.sprite(225, 450, 'large');
        medium = game.add.sprite(225, 350, 'medium');
        small = game.add.sprite(225, 250, 'small');

        large.anchor.setTo(0.5);
        medium.anchor.setTo(0.5);
        small.anchor.setTo(0.5);

        large.inputEnabled = true;
        medium.inputEnabled = true;
        small.inputEnabled = true;
        large.level = 0;
        medium.level = 1;
        small.level = 2;
        large.column = 0;
        medium.column = 0;
        small.column = 0;

        large.events.onInputDown.add(actions.select, this);
        medium.events.onInputDown.add(actions.select, this);
        small.events.onInputDown.add(actions.select, this);

        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function () { actions.moveDisk('up'); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function () { actions.moveDisk('down'); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function () { actions.moveDisk('left'); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function () { actions.moveDisk('right'); }, this);

        fresh = true;
        var demo = game.add.text(game.world.centerX, 200, "Click to Solve", { font: "65px Arial", fill: "#ffffff", align: "center" });
        demo.anchor.set(0.5);
        demo.inputEnabled = true;
        demo.events.onInputDown.add(actions.demo, this);
    },
    update: function() {
    // This function is called 60 times per second
    // It contains the game's logic
        if (!fresh) {
            demo.kill();
        } else if (small.column == 2 && medium.column == 2 && large.column == 2 && !moving) {
            var text = game.add.text(game.world.centerX, 200, "Congrats! You win!", { font: "65px Arial", fill: "#ffffff", align: "center" });
            text.anchor.set(0.5);
            reload = game.add.sprite(game.world.centerX, 250, 'reload');
            reload.anchor.set(0.5);
            reload.inputEnabled = true;
            reload.events.onInputDown.add(actions.restart, this);
        }
    },
};
var actions = {
    moveDisk: function(direction) {
        if (selected != null) {
            if (direction == 'left' && selected.level == 3 && selected.column !=0) {
                selected.column -= 1;
                selected.x = landscape.mapX(selected.column);
            } else if (direction == 'right' && selected.level == 3 && selected.column !=2) {
                selected.column += 1;
                selected.x = landscape.mapX(selected.column);
            } else if (direction == 'up' && landscape.checkUp() && !moving) {
                fresh = false;
                moving = true
                selected.level = 3;
                selected.y = landscape.mapY(selected.level);
            } else if (direction == 'down' && landscape.checkDown()
                        && moving) {
                moving = false
                selected.y = landscape.mapY(selected.level);
            }
        }
    },
    select: function(disk) {
        if (!moving) {
            if (selected != null){
                selected.tint = 0xffffff;
            }
            selected = disk;
            selected.tint = 0xbbbbbb;
        }
    },
    restart: function() {
        game.state.start('main');
    },
    demo: function() {
        select(small);
        moveDisk('up');
        moveDisk('right');
        moveDisk('right');
        moveDisk('down');
        select(medium);
        moveDisk('up');
        moveDisk('right');
        moveDisk('down');
        select(small);
        moveDisk('up');
        moveDisk('left');
        moveDisk('down');
        select(large);
        moveDisk('up');
        moveDisk('right');
        moveDisk('right');
        moveDisk('down');
        select(small);
        moveDisk('up');
        moveDisk('left');
        moveDisk('down');
        select(medium);
        moveDisk('up');
        moveDisk('right');
        moveDisk('down');
        select(small);
        moveDisk('up');
        moveDisk('right');
        moveDisk('right');
        moveDisk('down');
    }
};

var landscape = {
    createBlocks: function () {
        red1 = game.add.sprite(225, 525, 'red');
        red2 = game.add.sprite(625, 525, 'red');
        red3 = game.add.sprite(1025, 525, 'red');
        red1.anchor.setTo(0.5);
        red2.anchor.setTo(0.5);
        red3.anchor.setTo(0.5);
    },

    mapX: function(column) {
        switch(column) {
            case 0:
                return 225;
            case 1:
                return 625;
            case 2:
                return 1025;
        }
    },

    mapY: function(level) {
        switch(level) {
            case 0:
                return 450;
            case 1:
                return 350;
            case 2:
                return 250;
            case 3:
                return 100;
        }
    },

    checkUp: function() {

        if (small.column == selected.column && small.level > selected.level) {
            return false;
        } else if (medium.column == selected.column && medium.level > selected.level) {
            return false;
        } else if (large.column == selected.column && large.level > selected.level) {
            return false;
        } else {
            return true;
        }
    },

    checkDown: function() {
        if (selected.key == "small") {
            if (selected.column == medium.column) {
                selected.level = medium.level + 1;
            } else if (selected.column == large.column) {
                selected.level = large.level + 1;
            } else {
                selected.level = 0;
            }
            return true;
        } else if (selected.key == "medium") {
            if (selected.column == small.column) {
                return false;
            } else if (selected.column == large.column) {
                selected.level = large.level + 1;
            } else {
                selected.level = 0;
            }
            return true;
        } else if (selected.key == "large") {
            if (selected.column == small.column) {
                return false;
            } else if ( selected.column == medium.column ) {
                return false;
            } else {
                selected.level = 0;
            }
            return true;
        }
    }
}

// We initialising Phaser
var game = new Phaser.Game(1250, 600, Phaser.AUTO, 'gameDiv');
// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');
