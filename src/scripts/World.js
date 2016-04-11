// ==========
// World
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function World(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
    // Define current level:
}

World.prototype = new Entity();

// Initial, inheritable, default values
World.prototype.numberOfLanes = 7;
World.prototype.numberOfLanes2 = 7; 
			


World.prototype.render = function() {
	//látum hér ground + watn effect og kannski props, miðum við lanes og lanes 2 og g_laneHight
}

World.prototype.generate = function() {
	var totallength = (numberOfLanes + numberOfLanes2 + 3)*g_laneHight;
	var startingLoc = -0.5*totallength + 0.5*g_laneHight;
		//generate the Kid here
	for(var i = 0; i < numberOfLanes; i++){
		//generate a car-lane at "startingLoc+((i+1)*g_laneHight)"
	}
	var grassLoc = startingLoc + (numberOfLanes+1)*g_laneHight;
	for(var i = 0; i < numberOfLanes2; i++){
		//generate a river-lane at "grassLoc+((i+1)*g_laneHight)"
	}
};