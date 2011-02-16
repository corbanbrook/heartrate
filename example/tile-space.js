(function(){
  
  this.TileSpace = function TileSpace( w, h, size, wrap ){
    this.width = w;
    this.height = h;
    this.size = size;
    this.wrap = wrap || false;
    
    if (w % size !== 0) { throw "Tile size must divide evenly into width"; } 
    if (h % size !== 0) { throw "Tile size must divide evenly into height"; }
    
    this.xCount = this.width / this.size;
    this.yCount = this.width / this.size;
    var tileCount = this.xCount * this.yCount;
    this.tiles = new Array ( tileCount );
    for( var i = 0; i < tileCount; i++ ){
      var x = i % this.xCount;
      var y = ( ( i - x ) / this.xCount ) % this.yCount;
      this.tiles[ i ] = new TileSpace.prototype.tile( x, y, x * size, y * size, size, this, i );
    }
  };
  
  TileSpace.prototype.add = function( obj ){
    this.tiles[ parseInt( (obj.loc[0] >= 0 ? obj.loc[0] : 0) / this.width * this.xCount ) + 
                parseInt( (obj.loc[1] >= 0 ? obj.loc[1] : 0) / this.width * this.yCount ) * this.xCount
              ].add( obj );
  };

  
  TileSpace.prototype.tile = function tile( gridX, gridY, x, y, size, parent, index ){
    this.parent   = parent;
    this.size     = size;
    this.gridX    = gridX + 1;
    this.gridY    = gridY + 1;
    this.strMap   = gridX +':'+ gridY;
    this.index    = index
    this.extentX  = x + size;
    this.extentY  = y + size;
    this.bounds   = [ x, y, this.extentX, y, this.extentX, this.extentY, x, this.extentY ];
    //this.objects  = {}; // this is slow needs to be an array for fast tracing
    this.objects = [];
  };
  
  TileSpace.prototype.tile.prototype.add = function add( obj ){
    //if( !obj.tiles ) { obj.tiles = {}; }
    if( !obj.tiles ) { obj.tiles = []; }
    
    //this.objects[ obj.index ] = obj;
    this.objects.push(obj);
    
    //obj.tiles[ this.index ] = this;
    obj.tiles.push(this);
    
    // If the object extends outside it's boundaries, add it to adjacent squares
    // certain objects might have an area of influence like magnetic particles
    // object width and height would need to be adjusted for this AOI
    var extentX = obj.loc[0] + obj.w;
    if( extentX > this.extentX && this.gridX < this.parent.xCount ){
      this.parent.tiles[ this.index + 1 ].add( obj );
    } else if ( this.parent.wrap && extentX > this.extentX && this.gridX > this.parent.xCount ) {
      this.parent.tiles[ this.index - this.index % this.parent.xCount ].add( obj );
    }

    var extentY = obj.loc[1] + obj.h;
    if( extentY > this.extentY && this.gridY < this.parent.yCount ){
      this.parent.tiles[ this.index + this.parent.xCount ].add( obj );
    } else if ( this.parent.wrap && extentY > this.extentY && this.gridY > this.parent.yCount ) {
      this.parent.tiles[ this.gridX -1 ].add( obj );
    }
  };

  TileSpace.prototype.move = function move( obj ){
    // Delete this object from all current tiles
    /*for( var i in obj.tiles ){
      delete obj.tiles[ i ].objects[ obj.index ];
    }*/
    
    for( var i = 0, len = obj.tiles.length; i < len; i++) {
      var tileObjects = obj.tiles[i].objects;
      tileObjects.splice(tileObjects.indexOf(obj), 1);      
    }
    
    //obj.tiles = {};
    obj.tiles.length = 0;
    this.add( obj );
  };
  
  TileSpace.prototype.tile.prototype.remove = function remove( obj ){
    //console.log( delete this.objects[ obj.index ] );
  };
   
  TileSpace.prototype.xunits = function xunits( space ){ return parseInt( space / this.width * this.xCount ); }
  TileSpace.prototype.yunits = function yunits( space ){ return parseInt( space / this.height * this.yCount ); }
  
})();
