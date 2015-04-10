// We create our only state
var mainState = {
// Here we add all the functions we need for our state
// For this project we will just have 3 functions
preload: function() {
// This function will be executed at the beginning
// That's where we load the game's assets
// Load the image
game.load.image('small', 'blueHigh2.png');
game.load.image('medium', 'blueHigh4.png');
game.load.image('large', 'blueHigh6.png');
},
create: function() {
// This function is called after the preload function
// Here we set up the game, display sprites, etc.
this.small = game.add.sprite(50, 50, 'small');
this.medium = game.add.sprite(200, 200, 'medium');
this.large = game.add.sprite(350, 350, 'large');
},
update: function() {
// This function is called 60 times per second
// It contains the game's logic
this.small.angle += 1;
this.large.angle -= 1;
}
};
// We initialising Phaser
var game = new Phaser.Game(600, 600, Phaser.AUTO, 'gameDiv');
// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');