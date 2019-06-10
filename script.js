var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;
var mySound;
var myMusic;


function startGame() {
    myMusic = new sound("sound/theme.wav");
    myMusic.play();
    myGameArea.start();
    myGamePiece = new component(30, 30,"grey", 10, 120);
    myBackground = new component(656, 270, "image/dungeon.jpg", 0, 0, "image");
    myScore = new component("35px", "Ariel", "green", 280, 40, "text");
    mySound = new sound("sound/laser.mp3");
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
};


function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "image") {
            ctx.drawImage(this.image, this.x, this.x, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBottom();
        this.hitTop();
    };
    this.hitTop = function(){
        var top = myGameArea.canvas.height;
        if (this.height > top){
            this.y = top;
        }
    };
    this.hitBottom = function(){
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom){
            this.y = rockbottom;
        }
    };
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}


function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            mySound.play();
            myGameArea.stop();
            return;
        }
    }
    myGameArea.clear();
    myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "red", x, 0));
        myObstacles.push(new component(10, x - height - gap, "red", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myGamePiece.newPos();
    myGamePiece.update();
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
}


function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }else{
        return false;
    }
}


function moveup() {
    myGamePiece.speedY -= 1;
}


function movedown() {
    myGamePiece.speedY += 1;
}

// function moveleft() {
//     myGamePiece.speedX -= 1;
// }
//
// function moveright() {
//     myGamePiece.speedX += 1;
// }

function clearmove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    }
}








