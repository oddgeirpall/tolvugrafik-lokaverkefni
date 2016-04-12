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
    
    gl.uniform4fv( colorLoc, [1,1,0,1] ); // Set color to yellow
   
    var mvW = mult( g_renderMatrix,  translate( this.x, this.y,  10/2 ) );
    mvW = mult( mvW, scalem( 10, 10, 10 ) );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mvW));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
    
};