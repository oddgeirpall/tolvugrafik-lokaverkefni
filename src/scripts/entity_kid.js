function entity_kid(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

entity_kid.prototype = new Entity();

entity_kid.prototype.halfHeight = g_laneHeight/6;

entity_kid.prototype.isDrowning = false;
entity_kid.prototype.isExploding = false;

entity_kid.prototype.lane = 0;
entity_kid.prototype.x = 0;
entity_kid.prototype.y = 0;
entity_kid.prototype.z = g_laneHeight/6;
entity_kid.prototype.wobble = 0.1;


entity_kid.prototype.floatingA = false;
entity_kid.prototype.aboveWater = false;
entity_kid.prototype.isJumping = false;
entity_kid.prototype.moveRight = false;
entity_kid.prototype.moveLeft = false;
entity_kid.prototype.moveForward = false;
entity_kid.prototype.moveBackwards = false;

entity_kid.prototype.jumpTimer = g_laneHeight;
entity_kid.prototype.jumpDir = 1;

entity_kid.prototype.color = [0,1,1,1];

entity_kid.prototype.update = function(du){
    
    if (lookLeft === true) {
        if (lookAtPoint.x > -300) lookAtPoint.x -= 10*du;
    } else if (lookAtPoint.x < this.x) {
        if (lookAtPoint.x + 10*du > this.x) lookAtPoint.x = this.x;
            else lookAtPoint.x += 10*du;
    }
    if (lookRight === true) {
        if (lookAtPoint.x < 300) lookAtPoint.x += 10*du;
    } else if (lookAtPoint.x > this.x) {
        if (lookAtPoint.x - 10*du < this.x) lookAtPoint.x = this.x;
            else lookAtPoint.x -= 10*du;
    }
    
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
    
    if (this.isDrowning) {
        this.color[1] -= 0.02;
        this.z -= 0.5;
        if (this.z < -25) {
            this.color = [0,1,1,1];
            entityManager.enterLevel(entityManager._level);
        }
        return;
    }
    
    if (this._isDeadNow) {
        this.color[1] -= 0.02;
        this.color[2] -= 0.02;
        this.z -= 0.5;
        if (this.z < -25) {
            entityManager.enterLevel(entityManager._level);
        }
        return;
    }
    
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
    
    
        
	this.floatingA = false;
	this.aboveWater = false;
	this.amICollidingYo(du);

	if(!this.floatingA && this.aboveWater) {
        this._isDeadNow = true;
        this.isDrowning = true;
    }
	if(this.x < -370 || this.x > 320) console.log("kabúmm");
};

entity_kid.prototype.amICollidingYo = function ( du ) {
    //console.log('entity_kid rendering');
	this.whereAmI();
    var carBoi = entityManager.whosInMyLane(this.lane , this, du);
};


entity_kid.prototype.floating = function ( speed) {
    if(this.floating){
		this.x += speed;
		cameraPos.x += speed;
		lookAtPoint.x += speed;
		this.floatingA = true;
	}
};


entity_kid.prototype.whereAmI = function () {
	this.lane = Math.round((this.y/50) + 3 + entityManager._level);
	return this.lane;
};


entity_kid.prototype.kill = function () {
	console.log("hella dead");
    this._isDeadNow = true;
};

entity_kid.prototype.render = function draw() {
    //console.log('entity_kid rendering');
    /*
    gl.uniform4fv( colorLoc, this.color ); // Set color to aqua
   
    var mvKid = mult( g_renderMatrix,  translate( this.x, this.y, this.z ) );
    mvKid = mult( mvKid, scalem( 2*this.halfHeight, 2*this.halfHeight, 2*this.halfHeight ) );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeNormalBuffer );
    gl.vertexAttribPointer( nPosition, 3, gl.FLOAT, false, 0, 0);
    
    cubeNormalMatrix = [
        vec3(mvKid[0][0], mvKid[0][1], mvKid[0][2],
             mvKid[0][0], mvKid[1][1], mvKid[1][2],
             mvKid[0][0], mvKid[2][1], mvKid[2][2])
    ];
    
    var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0 );
    var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
    var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

    var materialAmbient = vec4( 0, 0.5, 0.5, 1.0 );
    var materialDiffuse = vec4( 0, 1.0, 1.0, 1.0 );
    var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mvKid));
    gl.uniformMatrix3fv(normalLoc, false, flatten(cubeNormalMatrix));
    
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices);
    
	*/
	gl.uniform4fv( colorLoc, this.color ); // Set color to aqua
	
	
	var mvKid = mult( g_renderMatrix,  translate( this.x, this.y, this.z + 7) );
    mvKid = mult( mvKid, scalem( this.halfHeight, this.halfHeight, this.halfHeight ) );

    gl.bindBuffer( gl.ARRAY_BUFFER, kidBuffer );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mvKid));
    gl.drawArrays( gl.TRIANGLES, 0, numKidVertices);
};