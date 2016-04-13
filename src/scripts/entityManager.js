

"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/

var entityManager = {

// "PRIVATE" DATA

_character   : [],
_world: [],
_grid : [],
_enemies   : [],
_objects    : [],

// "PRIVATE" METHODS

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._objects, this._character, this._world, this._grid, this._enemies];
},

resetAll: function() {
    this._character = [];
    this._enemies = [];
    this._objects = [];
    this._world = [];
    
    this.generateCharacter();

},

enterLevel: function(lvl) {
	
    this._enemies = [];
    this._objects = [];
    this._world = [];
    this._grid = [];
    
    
    // Create level
    this._level = lvl;
    this.generateLevel({
        numLanes: 2 + this._level
    });
    this._world[0].generate();
    
    // Create playable character
    this.generateCharacter({
        y : this._world[0].startingLoc
    });
    
    
    
    // Create enemies
    
    var numEnemies = this._level + 3;
    var numLanes = this._world[0].numLanes;
    
    for (var i = 0; i < numLanes; i++) { // Veggies
        var yDisplacement = this._world[0].startingLoc + g_laneHeight*(i+1);
        for (var j = 0; j < numEnemies; j++) {
			var temp = (690/numEnemies); 
            var xDisplacement = util.randRange(-370 + j*temp,-300 +(j+1)*temp);
            this.generateEnemy({
                x : xDisplacement,
                y : yDisplacement,
                goesLeft : i%2 === 0,
				lane : i + 1,
				speed : 0.9 + (((i+i)%3) * 0.2) 
            });
        }
    }

    
    for (var i = 0; i < numLanes; i++) { // Floaters
        var yDisplacement = this._world[0].startingLoc + g_laneHeight*(i+2+numLanes);
        for (var j = 0; j < numEnemies; j++) {
			var temp = (690/numEnemies); 
            var xDisplacement = util.randRange(-370 + j*temp,-355 +(j+1)*temp);
            this.generateFloater({
                x : xDisplacement,
                y : yDisplacement,
                goesLeft : i%2 === 0,
				lane: i + 2 + numLanes,
				speed : 0.9 + (((i+i)%3) * 0.2)
            });
        }
    }

    
    
    this.deferredSetup();
},


giveMeZelda : function(descr) {
    return this._character[0];
},

generateCharacter : function(descr) {
    this._character.push(new entity_kid(descr));
},

generateFloater : function(descr) {
    this._enemies.push(new entity_floater(descr));
    //console.log(this._enemies);
},


generateEnemy : function(descr) {
    this._enemies.push(new entity_car(descr));
    //console.log(this._enemies);
},

generateLevel : function(descr) {
    this._world.push(new World(descr));
    console.log('level');
},

generateObject : function(name, descr) {
    if (name === 'cloud') this._objects.push(new Cloud(descr));
    if (name === 'portal') this._objects.push(new Portal(descr));
},

// entities and centres have same dimensions, max 2
setBoxCentres: function(entities, centres) {
    for(var i=0; i<entities.length; i++){
        for(var j=0; j<entities[i].length; j++){
            if(entities[i][j]){
                entities[i][j].cx = centres[i][j][0];
                entities[i][j].cy = centres[i][j][1];
                entities[i][j].halfWidth = this._world[0].blockDim;
                entities[i][j].halfHeight = this._world[0].blockDim;
            }
        }
    }
},

// entities and centres have same dimensions, max 2
setDims: function(entities, dims) {
    for(var i=0; i<entities.length; i++){
        for(var j=0; j<entities[i].length; j++){
            if(entities[i][j]){
                entities[i][j].cx = centres[i][j][0];
                entities[i][j].cy = centres[i][j][1];
            }
        }
    }
},

update: function(du) {
	//console.log("totz updating yo");
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
                if(c === 1 && this._level === 6) { // Zelda won! 
					backgroundMusic.pause();
                    g_winScreenOn = true;
					
				}else if(c === 1) { // Zelda died! 
                    g_deathScreenOn = true;
                    backgroundMusic.pause();
                    util.playLoop(g_audio.themeDeath);                 
                }
            }
            else {
                ++i;
            }
        }
    }

},

render: function() {
    //console.log('is rendering');
    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {
            aCategory[i].render();
        }
        debugY += 10;
    }
},

whosInMyLane: function(lane, kid, du) {
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {
			var canInteract = aCategory[i].interactWithKid;
            if(canInteract)
				if(aCategory[i].lane === lane) 
					aCategory[i].interactWithKid(kid, du);
        }
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
