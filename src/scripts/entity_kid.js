function entity_kid(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

entity_kid.prototype = new Entity();

entity_kid.prototype.halfHeight = g_laneHeight/6;

entity_kid.prototype.lane = 0;
entity_kid.prototype.x = 0;
entity_kid.prototype.y = 0;
entity_kid.prototype.z = g_laneHeight/6;
entity_kid.prototype.wobble = 0.1;

entity_kid.prototype.aboveWater = false;
entity_kid.prototype.isJumping = false;
entity_kid.prototype.moveRight = false;
entity_kid.prototype.moveLeft = false;
entity_kid.prototype.moveForward = false;
entity_kid.prototype.moveBackwards = false;

entity_kid.prototype.jumpTimer = g_laneHeight;
entity_kid.prototype.jumpDir = 1;

entity_kid.prototype.update = function(du){
    
    if (this.moveLeft === true) {
        
        this.x -= 0.8*du;
        
        if (this.z > this.halfHeight + 1) this.wobble *= -1;
        else if (this.z < this.halfHeight) this.wobble *= -1
        this.z += this.wobble*du;
        
        
        cameraPos.x -= 0.8*du;
        lookAtPoint.x -= 0.*du;
    }
    
    if (this.moveRight === true) {
        
        this.x += 0.8*du;
        
        if (this.z > this.halfHeight + 1) this.wobble *= -1;
        else if (this.z < this.halfHeight) this.wobble *= -1
        this.z += this.wobble*du;
        
        
        cameraPos.x += 0.8*du;
        lookAtPoint.x += 0.8*du;
    }
    
    
    if (this.moveBackwards || this.moveForward) this.isJumping = true;
    
    if (this.isJumping === true) {
        
        if (this.moveForward === true) {
            
            this.y += 2;
            this.jumpTimer -= 2;
            
            if (this.z > this.halfHeight + 6) this.jumpDir = -1;
            
            this.z += 0.5*this.jumpDir;
            
            if (this.jumpTimer <= 0) {
                this.isJumping = false;
                this.moveForward = false;
                this.moveBackwards = false;
                this.jumpDir = 1;
                this.jumpTimer = g_laneHeight;
                this.z = this.halfHeight;
            }
            
            
            cameraPos.y += 2;
            lookAtPoint.y += 2;
            
        } else {
            
            this.y -= 2;
            this.jumpTimer -= 2;
            
            if (this.z > this.halfHeight + 6) this.jumpDir = -1;
            
            this.z += 0.5*this.jumpDir;
            
            if (this.jumpTimer <= 0) {
                this.isJumping = false;
                this.moveForward = false;
                this.moveBackwards = false;
                this.jumpDir = 1;
                this.jumpTimer = g_laneHeight;
                this.z = this.halfHeight;
            }
            
            
            cameraPos.y -= 2;
            lookAtPoint.y -= 2;
        }
        
        
    }
	this.aboveWater = false;
	this.amICollidingYo(du);
};

entity_kid.prototype.amICollidingYo = function ( du ) {
    //console.log('entity_kid rendering');
	this.whereAmI();
    var carBoi = entityManager.whosInMyLane(this.lane , this, du);
};


entity_kid.prototype.floating = function ( speed) {
    console.log('entity_kid rendering');
	this.x += speed;
	cameraPos.x += speed;
    lookAtPoint.x += speed;
	
};


entity_kid.prototype.whereAmI = function () {
	this.lane = Math.round((this.y/50) + 5);
	return this.lane;
};


entity_kid.prototype.kill = function () {
	console.log("hella dead");
};

entity_kid.prototype.render = function draw() {
    //console.log('entity_kid rendering');
    
    gl.uniform4fv( colorLoc, [0,1,1,1] ); // Set color to aqua
   
    var mvKid = mult( g_renderMatrix,  translate( this.x, this.y, this.z ) );
    mvKid = mult( mvKid, scalem( 2*this.halfHeight, 2*this.halfHeight, 2*this.halfHeight ) );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mvKid));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices);
    
};