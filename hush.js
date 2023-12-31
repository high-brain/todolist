
function playgame() {
  if (!myGameArea.interval) {
      myGameArea.interval = setInterval(updateGameArea, 20);
  } else {
      myGameArea.pause = false;
  }
}
function pausegame() {
  myGameArea.pause = true;
}

var myball;
var myGamePiece;
var myObstacles = [];

function startGame() {
  var x = 0, y = 12;
  myGameArea.start();
  myGamePiece = new component(100, 10, "red", myGameArea.canvas.width / 2 - 50, myGameArea.canvas.height - 20);
  myball = new component(7, 7, "black", myGameArea.canvas.width / 2 - 2.5 - 100, 110);    
  for (i = 0; i < 102; i++) {
      if ((x + 30) > myGameArea.canvas.width) {
          x = 0;
          y = y + 15;
      }
      if (x == 0) {x = 20; }
      x = x + 5;
      myObstacles.push(new component(30, 10, "green", x, y));
      x = x + 30;
  }
  myGameArea.setsize();
  myball.speedY -= 2;
  myball.speedX -= 2;    
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
      this.canvas.width = 640;
      this.canvas.height = 250;
      this.pause = false;
      this.frameNo = 0;
      this.canvas.style.cursor = "none"; 
      this.context = this.canvas.getContext("2d");
      myGameArea.interval = setInterval(updateGameArea, 20);
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      window.addEventListener('mousemove', function (e) {
          myGameArea.x = e.pageX;
          myGameArea.y = e.pageY;
      })
      window.addEventListener('devicemotion', function (e) {
          e.preventDefault();    
          var orientation = window.orientation;
          if (orientation == 0) {
              myGameArea.tiltX = e.accelerationIncludingGravity.x / myGameArea.scale;
              myGameArea.tiltY = -(e.accelerationIncludingGravity.y / myGameArea.scale);
          } else if (orientation == 90) {
              myGameArea.tiltY = -(e.accelerationIncludingGravity.x / myGameArea.scale);
              myGameArea.tiltX = -(e.accelerationIncludingGravity.y / myGameArea.scale);
          } else if (orientation == -90) {
              myGameArea.tiltY = e.accelerationIncludingGravity.x / myGameArea.scale;
              myGameArea.tiltX = e.accelerationIncludingGravity.y / myGameArea.scale;
          }
      });
      window.addEventListener('resize', function (e) {
          myGameArea.setsize();
      });        
  },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
      clearInterval(this.interval);
      this.pause = true;        
  },    
  setsize : function() {
      this.ratio = this.canvas.height / this.canvas.width,
      this.currentWidth = window.innerWidth;
      this.currentHeight = this.currentWidth * this.ratio;
      this.canvas.style.width = this.currentWidth - 20 + "px";
      this.canvas.style.height = this.currentHeight + "px";
      this.scale = this.currentWidth / this.canvas.width;
  }
  
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;    
  this.x = x;
  this.y = y;    
  this.update = function() {
      ctx = myGameArea.context;
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.crashLeft = function(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + (otherobj.width);
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + (otherobj.height);
      var crash = false;
      if (myleft < otherleft && myright > otherleft && mytop < otherbottom && mybottom > othertop) {
          crash = true;
      }
      return crash;
  }
  this.crashRight = function(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + (otherobj.width);
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + (otherobj.height);
      var crash = false;
      if (myright > otherright && myleft < otherright && mytop < otherbottom && mybottom > othertop) {
          crash = true;
      }
      return crash;
  }
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
  this.hitLeftBoundary = function() {
      var hit = false;
      var leftPos = this.x;
      if (leftPos <= 0) {
          hit = true;
      }
      return hit;
  } 
  this.hitRightBoundary = function() {
      var hit = false;
      var rightPos = this.x + this.width;
      if (rightPos > myGameArea.canvas.width) {
          hit = true;
      }
      return hit;
  }
  this.hitTopBoundary = function() {
      var hit = false;
      var topPos = this.y;
      if (topPos <= 0) {
          hit = true;
      }
      return hit;
  }     
  this.hitBottomBoundary = function() {
      var hit = false;
      var bottomPos = this.y + (this.height);
      if (bottomPos >= myGameArea.canvas.height) {
          hit = true;
      }
      return hit;
  }     
  this.hitAnyBoundary = function() {
      if (this.hitLeftBoundary()) {return true;}
      if (this.hitRightBoundary()) {return true;}
      if (this.hitTopBoundary()) {return true;}
      if (this.hitBottomBoundary()) {return true;}                        
      return false;
  }
}
var lastspeedX = 0;
var ss = 0;
function updateGameArea() {
  var x, y, speed = 0;
  for (i = 0; i < myObstacles.length; i += 1) {
      if (myball.crashWith(myObstacles[i])) {
          if (myball.crashLeft(myObstacles[i]) || myball.crashRight(myObstacles[i])) {
              myball.speedX = -(myball.speedX);            
          } else {
              myball.speedY = -(myball.speedY);            
          }
          myObstacles.splice(i, 1);
      } 
  }
  if (myGameArea.tiltX) {
      myGamePiece.speedX = myGameArea.tiltX + 1;
  }
  if (myGameArea.x) {
      myGamePiece.x = myGameArea.x;
      if (lastspeedX) {speed = (myGameArea.x - lastspeedX) / 2; }
      lastspeedX = myGameArea.x;
  }
  if (myball.crashWith(myGamePiece)) {
      myball.speedY = -(myball.speedY);
      myball.speedX = myball.speedX + speed;
      if (myball.speedX > 2) {myball.speedX = 2; }
  } 
  if (myball.hitLeftBoundary()) {
      myball.speedX = -(myball.speedX);
  } 
  if (myball.hitRightBoundary()) {
      myball.speedX = -(myball.speedX);
  } 
  if (myball.hitTopBoundary()) {
      myball.speedY = -(myball.speedY);
  } 
  if (myball.hitBottomBoundary()) {
      myGameArea.stop();
  }
  if (myGamePiece.hitAnyBoundary()) {
      if (myGamePiece.x < 0) {myGamePiece.x = 0;}
      if (myGamePiece.x > myGameArea.canvas.width - myGamePiece.width) {
          myGamePiece.x = myGameArea.canvas.width - myGamePiece.width;}
  }
  if (myGameArea.pause == false) {
      myGameArea.clear();
      myGameArea.frameNo += 1;
      for (i = 0; i < myObstacles.length; i += 1) {
          myObstacles[i].update();
      }
      myball.x += myball.speedX;
      myball.y += myball.speedY;    
      myball.update();
      myGamePiece.x += myGamePiece.speedX;
      myGamePiece.y += myGamePiece.speedY;    
      myGamePiece.update();
      if (myGameArea.frameNo == 1) {
          myGameArea.pause = true;
      }
  }
}