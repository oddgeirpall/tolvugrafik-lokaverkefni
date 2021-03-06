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
World.prototype.numSidewalks = 3;
World.prototype.numLanes = 3;
World.prototype.numBlocks = 14;
World.prototype.blockWidth = g_laneHeight;
World.prototype.startingLoc;
World.prototype.waterCounter = 0;

World.prototype.update = function(du) {};

World.prototype.render = function() {
    
    // Draw ground
    gl.uniform4fv( colorLoc, [0,1,0,1] ); // Set color to green
    
    for ( var i = -1; i < 2; i += 2) { // Either side of the platform
        var mvGround = mult( g_renderMatrix,  translate( -22, i*(this.startingLoc - 100), -2 ) );
        mvGround = mult( mvGround, scalem( this.blockWidth*7, 75, 2 ) );

        gl.bindBuffer( gl.ARRAY_BUFFER, groundBuffer );
        gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );

        gl.uniformMatrix4fv(mvLoc, false, flatten(mvGround));
        gl.drawArrays( gl.TRIANGLES, 0, numGroundVertices );
    }
    
    
    // Draw sidewalks
    gl.uniform4fv( colorLoc, [0.83, 0.83, 0.83, 1] ); // Set color to light grey
    
    for (var i = 0; i < this.numSidewalks; i++) {
        var yDisplacement = this.startingLoc + i*(this.numLanes+1)*this.blockWidth;
        
        for (var j = 0; j < this.numBlocks; j++) {
            var xDisplacement = -7*this.blockWidth + j*this.blockWidth;
            
            var mvSidewalks = mult( g_renderMatrix,  translate( xDisplacement, yDisplacement, -5 ) );
            mvSidewalks = mult( mvSidewalks, scalem( this.blockWidth-1, this.blockWidth-1, 10 ) );

            gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
            gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

            gl.uniformMatrix4fv(mvLoc, false, flatten(mvSidewalks));
            gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
        };
    };
    
    // Draw road
    gl.uniform4fv( colorLoc, [0.3,0.3,0.3,1] ); // Set color to dark grey
    
    for (var i = 0; i < this.numLanes; i++) {
        var mvRoad = mult( g_renderMatrix,  translate( -22, this.startingLoc + (i+1)*this.blockWidth, -5 ) );
        mvRoad = mult( mvRoad, scalem( this.blockWidth*14, this.blockWidth-1, 10 ) );

        gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

        gl.uniformMatrix4fv(mvLoc, false, flatten(mvRoad));
        gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
    }
    
    // Draw water
    gl.uniform4fv( colorLoc, [0,0,1,1] ); // Set color to blue
    
    for (var i = 0; i < this.numLanes; i++) {
        for (var j = 0; j < this.numBlocks; j++) {
            var mvWater = mult( g_renderMatrix,  translate( -7*this.blockWidth + j*this.blockWidth, 
                                this.startingLoc + (this.numLanes+1)*this.blockWidth + (i+1)*this.blockWidth, -5 ) );
            mvWater = mult( mvWater, scalem( this.blockWidth/1.7, this.blockWidth/1.7, 25) );

            gl.bindBuffer( gl.ARRAY_BUFFER, groundBuffer );
            gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );

            gl.uniformMatrix4fv(mvLoc, false, flatten(mvWater));
            gl.drawArrays( gl.TRIANGLES, 0, numGroundVertices );
        };
    };
	
	
	//draw kid
	
	
	
	
	
};

World.prototype.generate = function() {
    
	var totallength = (this.numSidewalks + 2*this.numLanes)*g_laneHeight;
	this.startingLoc = -0.5*totallength + 0.5*g_laneHeight;

};