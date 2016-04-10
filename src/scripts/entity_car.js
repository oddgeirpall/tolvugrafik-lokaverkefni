function entity_car(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

entity_car.prototype.x = Math.random()*g_canvas.width;
entity_car.prototype.y = Math.random()*g_canvas.width;

entity_car.prototype.update = function(du){
	this.x = Math.random()*g_canvas.width;
	this.y = Math.random()*g_canvas.width;
};


entity_car.prototype.render = function draw() {
    
    //Draw the walls first
    gl.uniform4fv( colorLoc, YELLOW ); // Set color to yellow
    
    var mvW = mult( g_renderMatrix,  translate( this.x, y,  10/2 ) );
    mvW = mult( mvW, scalem( 10, 10, 10 ) );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mvW));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
    
    // Then draw the roof
    gl.uniform4fv( colorLoc, RED ); // Set color to red
    
    var mvR = mult( g_renderMatrix,  translate( this.x, y, 3*10/2 ) );
    mvR = mult( mvR, scalem( 10, 10, 10 ) );
    mvR = mult( mvR, rotateX(-90));
    
    gl.bindBuffer( gl.ARRAY_BUFFER, roofBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    
    gl.uniformMatrix4fv(mvLoc, false, flatten(mvR) );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, numRoofVertices );
    
};