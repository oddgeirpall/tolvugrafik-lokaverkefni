function entity_floater(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
	if(Math.random() > 0.8) this.sucker = true;
    else this.sucker = false;
}

entity_floater.prototype = new Entity();

entity_floater.prototype.x = 0;
entity_floater.prototype.y = 0;
entity_floater.prototype.z = 5;
entity_floater.prototype.sucker;
entity_floater.prototype.speed = 1;
entity_floater.prototype.length = 2;
entity_floater.prototype.counter = 0;
entity_floater.prototype.deadly = false;
entity_floater.prototype.goesLeft = false;


entity_floater.prototype.interactWithKid = function(kid, du){
    if(Math.abs(kid.x - this.x) < 16*this.length && !this.deadly) 
		if(this.goesLeft) kid.floating(-this.speed*du);
		else kid.floating(this.speed*du);
	kid.aboveWater = true;
	
};

entity_floater.prototype.update = function(du){
    if (this.x > 320){
		this.x = -370;
		if(Math.random() > 0.8) 
			this.sucker = true;
		else this.sucker = false;
		this.z = 5;
	} else if (this.x < -370 ){
		this.x = 320;
		this.z = 5;
		if(Math.random() > 0.8) 
			this.sucker = true;
		else this.sucker = false;
	}	
	
	//sucker-Logic
	if(this.sucker){
		this.counter 	+= 			du*0.3;
		if		(this.counter > 90)	{this.counter 	= 0; this.z = 5;}
		else if	(this.counter > 50)	{	
										this.deadly = true;
										this.z = -5 + 
										0.5*Math.abs(70 - this.counter);
									}
		if		(this.counter < 57)	this.deadly 	= false;
	} 	else 						this.deadly 	= false;

    if (this.goesLeft) this.x -= du;
    else this.x += du*this.speed;
    
};

entity_floater.prototype.render = function draw() {
    //console.log('entity_floater rendering');
    
    //Draw the walls first
    
	if(this.sucker) {
		if(this.deadly) gl.uniform4fv( colorLoc, [1,0,0,1] );
		else			gl.uniform4fv( colorLoc, [0.7,0.1,0.5,1] );
		
		var mvW = mult( g_renderMatrix,  translate( this.x, this.y,  this.z - 6) );
		mvW = mult( mvW, scalem( 10, 10, 10 ) );
		gl.bindBuffer( gl.ARRAY_BUFFER, floater2Buffer );
		gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
		gl.uniformMatrix4fv(mvLoc, false, flatten(mvW));
		gl.drawArrays( gl.TRIANGLES, 0, numFloater2Vertices );
		
		var mvW = mult( g_renderMatrix,  translate( this.x + 20, this.y,  this.z - 6) );
		mvW = mult( mvW, scalem( 10, 10, 10 ) );
		gl.bindBuffer( gl.ARRAY_BUFFER, floater2Buffer );
		gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
		gl.uniformMatrix4fv(mvLoc, false, flatten(mvW));
		gl.drawArrays( gl.TRIANGLES, 0, numFloater2Vertices );
		
		var mvW = mult( g_renderMatrix,  translate( this.x - 20, this.y,  this.z - 6) );
		mvW = mult( mvW, scalem( 10, 10, 10 ) );
		gl.bindBuffer( gl.ARRAY_BUFFER, floater2Buffer );
		gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
		gl.uniformMatrix4fv(mvLoc, false, flatten(mvW));
		gl.drawArrays( gl.TRIANGLES, 0, numFloater2Vertices );
		
	
	}
	else { 
		gl.uniform4fv( colorLoc, [0.3,0.15,0,1] );
	
		var mvW = mult( g_renderMatrix,  translate( this.x, this.y,  this.z - 6) );
		mvW = mult( mvW, scalem( 5*this.length, 10, 10 ) );
		gl.bindBuffer( gl.ARRAY_BUFFER, floater1Buffer );
		gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
		gl.uniformMatrix4fv(mvLoc, false, flatten(mvW));
		gl.drawArrays( gl.TRIANGLES, 0, numFloater1Vertices );
	}
};
