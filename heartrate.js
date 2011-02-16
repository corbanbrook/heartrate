function HeartRate(options) {
  this.context          = options && options.context || false;
  this.maxFPS           = options && options.maxFPS || 50;
  this.path             = options && options.path || "./heartrate";
  this.frameRate        = 0;
  this.frameCount       = 0;
  this.framesPerSecond  = 0;
  this.timeline         = new Array(16);
  this.lastUpdate       = (new Date()).getTime() / 1000;
  this.updated          = false;

  if (this.context) {
    // Background template
    this.bgImage        = new Image(), this.bgImage.src = this.path + "/images/bg.png";
    
    // Sprite strip
    this.sprites        = new Image();
    this.sprites.src    = this.path + "/images/spritestrip.png";
    this.spriteCount    = 61;
    this.spriteWidth    = 20;
    this.spriteHeight   = 18;
    this.spritesReady   = false;
    
    this.sprites.onload = (function(heartRate) {
      return function() { heartRate.spritesReady = true; };
    }(this));
    
    // Text color
    this.textColor      = "rgba(100, 64, 64, 1)";
    
    // Graph plot color
    this.plotColor     = "rgba(200, 64, 80, 1)";
  }
}

HeartRate.prototype.calculate = function() {
  var frameTime = (new Date()).getTime();
  
  if (frameTime - this.lastUpdate > 1000) { // update FPS every 1000 ms
    this.frameRate = this.framesPerSecond / (frameTime - this.lastUpdate) * 1000;
    this.lastUpdate = frameTime;

    this.timeline.shift();
    this.timeline.push(this.frameRate);
    
    this.framesPerSecond = 0;
  } else {
    this.framesPerSecond++;
  }
  
  this.frameCount++;
  this.updated = true;
};

// This method calculates FPS and Renders the monitor
HeartRate.prototype.monitor = function(x, y) {
  // only calculate if calculate has not already been called somewhere else
  !this.updated && this.calculate(), this.updated = false;
  
  var ctx = this.context;

  if (ctx && this.spritesReady) {
    var plotScale = 4;
    var spriteWidth = this.spriteWidth;
    var spriteHeight = this.spriteHeight;
    
    ctx.save();
      ctx.translate(x, y);
      
      // Background
      ctx.drawImage(this.bgImage, 0, 0);
      ctx.drawImage(this.sprites, (this.frameCount % this.spriteCount) * spriteWidth, 0, spriteWidth, spriteHeight, 9, 6, spriteWidth, spriteHeight);
      
      // Line graph
      ctx.strokeStyle = this.plotColor;
      
      for (var i = 0, len = this.timeline.length - 1; i < len; i++) {
        var plot1 = 25 - this.timeline[i] / this.maxFPS * 20, 
            plot2 = 25 - this.timeline[i+1] / this.maxFPS * 20;
                        
        if (!isNaN(plot1)) { 
          ctx.beginPath();
            ctx.moveTo(i * plotScale + 64, plot1);
            ctx.lineTo((i+1) * plotScale + 64, plot2);
            ctx.stroke();
          ctx.closePath();
        }
      }
    
      // Text
      ctx.fillStyle = this.textColor;
      ctx.fillText(this.frameRate.toFixed(0), 33, 17);
    ctx.restore();
  }
};
