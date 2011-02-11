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
    this.bgImage = new Image(), this.bgImage.src = this.path + "/images/bg.png";
    
    this.hearts = [];
    
    for (var i = 0; i < 31; i ++) {
      var prefix = i < 10 ? "spin000" : "spin00"; 
      this.hearts.push(new Image());
      this.hearts[i].src = this.path + "/images/" + prefix + i + ".png";
    }
    
    // Text color
    this.textColor = "rgba(100, 64, 64, 1)";
    
    // Graph color
    this.graphColor = "rgba(200, 64, 80, 1)";
  }
}

HeartRate.prototype.update = function() {
  var frameTime = (new Date()).getTime() / 1000;
  
  if (frameTime - this.lastUpdate > 1) {
    this.frameRate = this.framesPerSecond / (frameTime - this.lastUpdate);
    this.lastUpdate = frameTime;

    this.timeline.push(this.frameRate);
    this.timeline = this.timeline.slice(1);
    
    this.framesPerSecond = 0;
  } else {
    this.framesPerSecond++;
  }
  
  this.frameCount++;
  this.updated = true;
};

// This method calculates FPS and Renders the monitor
HeartRate.prototype.monitor = function(x, y) {
  // only update if update has not already been called somewhere else
  !this.updated && this.update(), this.updated = false;
  
  var ctx = this.context;

  if (ctx) {
    var scaleX = 4;
    
    ctx.save();
      ctx.translate(x, y);
      
      // Background
      ctx.drawImage(this.bgImage, 0, 0);
      ctx.drawImage(this.hearts[this.frameCount % 30], 9, 6, 20, 18);
      
      // Line graph
      ctx.strokeStyle = this.graphColor;
      
      for (var i = 0, len = this.timeline.length - 1; i < len; i++) {
        var plot1 = 25 - this.timeline[i] / this.maxFPS * 20, 
            plot2 = 25 - this.timeline[i+1] / this.maxFPS * 20;
                        
        isNaN(plot1) || line(i * scaleX + 64, plot1, (i+1) * scaleX + 64, plot2);
      }
    
      // Text
      ctx.fillStyle = this.textColor;
      ctx.fillText(this.frameRate.toFixed(0), 33, 17);
    ctx.restore();
  }
};
