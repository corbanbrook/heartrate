(function(){
  
  this.TileSpace = function TileSpace( x, y, w, h, size ){
    this.x = x;
    this.y = x;
    this.width = w;
    this.height = h;
    this.size = size;
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
    this.objects  = {};
  };
  
  TileSpace.prototype.tile.prototype.add = function add( obj ){
    
    if( !obj.tiles ){ obj.tiles = {} };
    this.objects[ obj.index ] = obj;
    obj.tiles[ this.index ] = this;
    
    // If the object extends outside it's boundaries, add it to adjacent squares
    var extentX = obj.loc[0] + obj.w;
    if( extentX > this.extentX && this.gridX < this.parent.xCount ){
      this.parent.tiles[ this.index + 1 ].add( obj );
    }

    var extentY = obj.loc[1] + obj.h;
    if( extentY > this.extentY && this.gridY < this.parent.yCount ){
      this.parent.tiles[ this.index + this.parent.xCount ].add( obj );
    }
    
  };

  TileSpace.prototype.move = function move( obj ){
    for( var i in obj.tiles ){
      delete obj.tiles[ i ].objects[ obj.index ];
    }
    obj.tiles = {};
    this.add( obj );
  };
  
  TileSpace.prototype.tile.prototype.remove = function remove( obj ){
    //console.log( delete this.objects[ obj.index ] );
  };
   
  TileSpace.prototype.xunits = function xunits( space ){ return parseInt( space / this.width * this.xCount ); }
  TileSpace.prototype.yunits = function yunits( space ){ return parseInt( space / this.height * this.yCount ); }
  
})();
