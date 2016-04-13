function entity_car(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

entity_car.prototype = new Entity();

entity_car.prototype.speed = 1;
entity_car.prototype.lane = 0;
entity_car.prototype.x = 0;
entity_car.prototype.y = 0;
entity_car.prototype.goesLeft = false;

entity_car.prototype.updateInterval = 2;

entity_car.prototype.update = function(du){
    if (this.x > 320){
		this.x = -370;
	} else if (this.x < -370 ){
		this.x = 320;
	}
    
    if (this.goesLeft) this.x -= du;
    else this.x += du*this.speed;	
};

entity_car.prototype.interactWithKid = function(kid, du){
    if(Math.abs(kid.x - this.x) < 16) kid.kill();
};

entity_car.prototype.render = function draw() {
    //console.log('entity_car rendering');
    if(this.lane % 3 === 1){
		gl.uniform4fv( colorLoc, [0.8,0.4,0,1] ); // Set color to orange
   
		var mvW = mult( g_renderMatrix,  translate( this.x, this.y,  14 ) );
		mvW = mult( mvW, scalem( 4, 4, 3 ) );

		gl.bindBuffer( gl.ARRAY_BUFFER, car1Buffer );
		gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );

		gl.uniformMatrix4fv(mvLoc, false, flatten(mvW));
		gl.drawArrays( gl.TRIANGLES, 0, numCar1Vertices );
	} else if(this.lane % 3 === 2){
		gl.uniform4fv( colorLoc, [0.1,0.3,0.1,4] ); // Set color to green
   
		var mvW = mult( g_renderMatrix,  translate( this.x, this.y,  14 ) );
		mvW = mult( mvW, scalem( 6, 6, 7 ) );

		gl.bindBuffer( gl.ARRAY_BUFFER, car2Buffer );
		gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );

		gl.uniformMatrix4fv(mvLoc, false, flatten(mvW));
		gl.drawArrays( gl.TRIANGLES, 0, numCar2Vertices );
	} else {
		gl.uniform4fv( colorLoc, [0.5,0.2,0,15] ); // Set color to red
   
		var mvW = mult( g_renderMatrix,  translate( this.x, this.y-2,  10 ) );
		mvW = mult( mvW, scalem( 11, 11, 10 ) );

		gl.bindBuffer( gl.ARRAY_BUFFER, car3Buffer );
		gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );

		gl.uniformMatrix4fv(mvLoc, false, flatten(mvW));
		gl.drawArrays( gl.TRIANGLES, 0, numCar3Vertices );
	} 
};