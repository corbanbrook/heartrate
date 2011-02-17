HeartRate 
=========

#### an fps monitor for HTML5 canvas demos ####


**Author:** Corban Brook [@corban](http://twitter.com/corban)
**3D Modelling:** Tomasz Dysinkski [@bunnybones](http://twitter.com/bunnybones]

[View the LIVE Demo!](http://weare.buildingsky.net/heartrate/example/flocking.html)

HeartRate is a cute fps calculator and monitor you can *EASILY* add to your
HTML5 Canvas demos. HeartRate intends to be aesthetically rich and customizable
yet light on CPU cycles. It is composed of 3 parts: 

* an animated icon, 
* fps text display, 
* and a line graph.

![20110217-x4kdwt4rnn4rr6ncrwr2gkbmyk.jpg](https://img.skitch.com/20110217-x4kdwt4rnn4rr6ncrwr2gkbmyk.jpg)

The idea was taken from the wonderful [@mrdoob](http://twitter.com/mrdoob)'s
**Stats.js** available on [github](https://github.com/mrdoob/stats.js). I noticed
the fancy meter seemed to add a lot of aesthetic value to the demos. So why not
contribute another fancy meter to the HTML5 demoscene?

### THANKS ###

After showing [Tomasz Dysinkski](http://twitter.com/bunnybones)  my initial design he offered to donate 20 mins
of his time and quickly modelled up a 3d rotating heart. I think it looks
great, Thank you!

[Bobby Richter](http://twitter.com/secretrobotron) helped optimize the flocking demo and find bugs.


### USAGE ###

Using HeartRate is easy, simply add it to the draw loop you wish to monitor.

    var FPS = 50;

    var heartRate = new HeartRate({{context: ctx, maxFPS: FPS, path: "./heartrate"}); 

    window.setInterval(draw, 1000/FPS);
    
    function draw() {
      heartRate.monitor(10, 10); // calculates FPS and renders HeartRate monitor on canvas x, y position

      //..
    }

If you wish you can use HeartRate without canvas to simply calculate fps and frameCount.

    var FPS = 50;

    var heartRate = new HeartRate(); 

    window.setInterval(draw, 1000/FPS);
    
    function draw() {
      heartRate.calculate(); // calculates FPS in headless mode
      
      console.log(heartRate.frameRate + " " + heartRate.frameCount);

      //..
    }


### CUTOMIZATION ###

Customizing the theme of HeartRate is dead simple. HeartRate loads 2 images:
bg.png and spritestrip.png, they along with spritestrip.html (a sprite strip
generator) can be found in the heartrate/images/ directory. You can swap out
these images with something of your choosing.

spritestrip.html is a simple generator script which loads, scales and draws 
multiple images into a canvas element, which can be saved as a dataURL or 
right-clicked and saved as an image (.png to preserve transparency).

If your sprite or bg dimensions change from the default you will have to edit
heartRate.js and modify some width and height properties but it should be easy
enough to figure out what is going on, HeartRate is less than 100 lines of code
after all and plans to stay that way :)

If you do end up making your own theme, drop me a message, I would love to see it.
Theme support might be a cool feature to add.

re,
Corban
