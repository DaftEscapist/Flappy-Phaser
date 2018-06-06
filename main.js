var game = new Phaser.Game("100%", "100%", Phaser.AUTO, "gameDiv");
var bgcounter = 0;
var mainState = {

    preload: function() { 
        if(!game.device.desktop) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
        }
        
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.stage.backgroundColor = '#71c5cf';
        game.load.image("background1", 'assets/bg1.png');
        game.load.image("background3", 'assets/bg2.jpg');
        game.load.image("background2", 'assets/bg3.png');
        game.load.image('bird', 'assets/bird.png');  
        game.load.image('pipe', 'assets/pipe.png'); 
        game.load.image('pipetop', 'assets/pipetop.png')

        // Load the jump sound
        game.load.audio('jump', 'assets/jump.wav'); 
    },

    create: function() { 
        game.physics.startSystem(Phaser.Physics.ARCADE);

        if(bgcounter % 3 == 0)
            game.add.tileSprite(0, 0, 1920, 1080, 'background1');
        if(bgcounter % 3 == 1)
            game.add.tileSprite(0, 0, 1920, 1080, 'background2'); 
        if(bgcounter % 3 == 2)
          game.add.tileSprite(0, 0, 1920, 1080, 'background3'); 

        this.pipes = game.add.group();
        this.timer = game.time.events.loop(2000, this.addRowOfPipes, this);           

        this.bird = game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000; 

        // New anchor position
        this.bird.anchor.setTo(-0.2, 0.5); 
 
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 
        game.input.onDown.add(this.jump, this);

        this.score = -2;
        this.labelScore = game.add.text(20, 20, "0", { font: "70px Arial", fill: "#ffffff" });  

        // Add the jump sound
        this.jumpSound = game.add.audio('jump');
        this.jumpSound.volume = 0.2;
    },

    update: function() {
        if (this.bird.y < 0 || this.bird.y > game.world.height)
            this.restartGame(); 

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); 

            
        // Slowly rotate the bird downward, up to a certain point.
        if (this.bird.angle < 20)
            this.bird.angle += 1;  
    },

    jump: function() {
        // If the bird is dead, he can't jump
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -450;

        // Jump animation
        game.add.tween(this.bird).to({angle: -20}, 100).start();

        // Play sound
        this.jumpSound.play();
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, we have nothing to do
        if (this.bird.alive == false)
            return;

        
        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);
    
        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    restartGame: function() {
        game.state.start('main');
        bgcounter += 1;
    },

    addOnePipe: function(x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);
 
        pipe.body.velocity.x = -400;
        if (this.score % 3 == 0)
            pipe.body.velocity.x -= 10; 
        if (this.score % 5 ==0)
            pipe.body.velocity.x -= 50;
        if (this.score % 7 ==0)
            pipe.body.velocity.x -= 70;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addOnePipeTop: function(x, y) {
        var pipetop = game.add.sprite(x, y, 'pipetop');
        this.pipes.add(pipetop);
        game.physics.arcade.enable(pipetop);

        pipetop.body.velocity.x = -400; 
        if (this.score % 3 == 0)
            pipetop.body.velocity.x -= 10; 
        if (this.score % 5 ==0)
            pipetop.body.velocity.x -= 50;
        if (this.score % 7 ==0)
            pipetop.body.velocity.x -= 70;      
        pipetop.checkWorldBounds = true;
        pipetop.outOfBoundsKill = true;
    },
        
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*12)+1;
        var pipecounter = 0;
    
        for (var i = 0; i < 16; i++) {
            if (i != hole && i != hole + 1 && i != hole - 2 && i != hole - 1 && i != hole +2) 
                this.addOnePipe(1800, i*60+10);    
            if (i == hole + 2 || i == hole - 2)
                this.addOnePipeTop(1797, i*60+10);
        }
        if (this.bird.alive == true)
            this.score += 1;
            if (this.score > 0)
                this.labelScore.text = this.score;  
        
    },
};

game.state.add('main', mainState);  
game.state.start('main'); 