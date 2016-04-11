function entity_car(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

entity_car.prototype = new Entity();

entity_car.prototype.x = 0;
entity_car.prototype.y = 0;

entity_car.prototype.updateInterval = 2;

entity_car.prototype.update = function(du){
    if (this.x < -100 || this.x > 100) this.updateInterval *= -1;
    
    this.x += this.updateInterval;
    //console.log(du);
    
    //console.log('entity_car updating');
};


entity_car.prototype.render = function draw() {
    //console.log('entity_car rendering');
    
    //Draw the walls first
    gl.uniform4fv( colorLoc, YELLOW ); // Set color to yellow
   
    var mvW = mult( g_renderMatrix,  translate( this.x, this.y,  10/2 ) );
    mvW = mult( mvW, scalem( 10, 10, 10 ) );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mvW));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
    
    /*
    // Then draw the roof
    gl.uniform4fv( colorLoc, vec4(1.0, 1.0, 0.0, 1.0) ); // Set color to red
    
    var mvR = mult( g_renderMatrix,  translate( 0, 0, 3*10/2 ) );
    mvR = mult( mvR, scalem( 10, 10, 10 ) );
    mvR = mult( mvR, rotateX(-90));
    
    gl.bindBuffer( gl.ARRAY_BUFFER, roofBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    
    gl.uniformMatrix4fv(mvLoc, false, flatten(mvR) );
    //gl.drawArrays( gl.TRIANGLE_STRIP, 0, numRoofVertices );
    */
};