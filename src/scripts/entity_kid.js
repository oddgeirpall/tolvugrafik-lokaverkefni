function entity_kid(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

entity_kid.prototype = new Entity();

entity_kid.prototype.x = 0;
entity_kid.prototype.y = 0;
entity_kid.prototype.z = g_laneHeight/2;
entity_kid.prototype.wobble = 0.1;

entity_kid.prototype.isJumping = false;
entity_kid.prototype.moveRight = false;
entity_kid.prototype.moveLeft = false;
entity_kid.prototype.moveForward = false;
entity_kid.prototype.moveBackwards = false;

entity_kid.prototype.jumpTimer = g_laneHeight;
entity_kid.prototype.jumpDir = 1;

entity_kid.prototype.update = function(du){
    
    if (this.moveLeft === true) {
        
        this.x -= 0.5*du;
        
        if (this.z > g_laneHeight/2 + 1) this.wobble *= -1;
        else if (this.z < g_laneHeight/2) this.wobble *= -1
        this.z += this.wobble*du;
        
        
        cameraPos.x = this.x;
        lookAtPoint.x = this.x;
    }
    
    if (this.moveRight === true) {
        
        this.x += 0.5*du;
        
        if (this.z > g_laneHeight/2 + 1) this.wobble *= -1;
        else if (this.z < g_laneHeight/2) this.wobble *= -1
        this.z += this.wobble*du;
        
        
        cameraPos.x = this.x;
        lookAtPoint.x = this.x;
    }
    
    
    if (this.moveBackwards || this.moveForward) this.isJumping = true;
    
    if (this.isJumping === true) {
        
        if (this.moveForward === true) {
            
            this.y += 2*du;
            this.jumpTimer -= 2*du;
            
            if (this.z > g_laneHeight/2 + 5) this.jumpDir = -1;
            
            this.z += 0.5*du*this.jumpDir;
            
            if (this.jumpTimer <= 0) {
                this.isJumping = false;
                this.moveForward = false;
                this.moveBackwards = false;
                this.jumpDir = 1;
                this.jumpTimer = g_laneHeight;
            }
            
            
            cameraPos.y += 2*du;
            lookAtPoint.y += 2*du;
            
        } else {
            
            this.y -= 2*du;
            this.jumpTimer -= 2*du;
            
            if (this.z > g_laneHeight/2 + 5) this.jumpDir = -1;
            
            this.z += 0.5*du*this.jumpDir;
            
            if (this.jumpTimer <= 0) {
                this.isJumping = false;
                this.moveForward = false;
                this.moveBackwards = false;
                this.jumpDir = 1;
                this.jumpTimer = g_laneHeight;
            }
            
            
            cameraPos.y -= 2*du;
            lookAtPoint.y -= 2*du;
        }
        
        
    }
    
};


entity_kid.prototype.render = function draw() {
    //console.log('entity_kid rendering');
    
    gl.uniform4fv( colorLoc, [0,1,1,1] ); // Set color to aqua
   
    var mvKid = mult( g_renderMatrix,  translate( this.x, this.y, this.z ) );
    mvKid = mult( mvKid, scalem( g_laneHeight-5, g_laneHeight-5, g_laneHeight-5 ) );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mvKid));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
    
};