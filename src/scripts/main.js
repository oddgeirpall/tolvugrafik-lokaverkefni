// ========
// MAINLOOP
// ========
/*

The mainloop is one big object with a fairly small public interface
(e.g. init, iter, gameOver), and a bunch of private internal helper methods.

The "private" members are identified as such purely by the naming convention
of having them begin with a leading underscore. A more robust form of privacy,
with genuine name-hiding *is* possible in JavaScript (via closures), but I 
haven't adopted it here.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


var main = {
    
    // "Frame Time" is a (potentially high-precision) frame-clock for animations
    _frameTime_ms : null,
    _frameTimeDelta_ms : null,

};

// Perform one iteration of the mainloop
main.iter = function (frameTime) {
    
    // Use the given frameTime to update all of our game-clocks
    this._updateClocks(frameTime);
    
    // Perform the iteration core to do all the "real" work
    this._iterCore(this._frameTimeDelta_ms);
    
    // Diagnostics, such as showing current timer values etc.
    //this._debugRender(g_ctx);
    
    // Request the next iteration if needed
    this._requestNextIteration();
};

main._updateClocks = function (frameTime) {
    
    // First-time initialisation
    if (this._frameTime_ms === null) this._frameTime_ms = frameTime;
    
    // Track frameTime and its delta
    this._frameTimeDelta_ms = frameTime - this._frameTime_ms;
    this._frameTime_ms = frameTime;
};

main._iterCore = function (dt) {
    //gatherInputs();
    update(dt);
    render();
    //console.log('iterCore');
};

// Shim for Firefox and Safari
window.requestAnimationFrame = 
    window.requestAnimationFrame ||        // Chrome
    window.mozRequestAnimationFrame ||     // Firefox
    window.webkitRequestAnimationFrame;    // Safari

// This needs to be a "global" function, for the "window" APIs to callback to
function mainIterFrame(frameTime) {
    main.iter(frameTime);
}

main._requestNextIteration = function () {
    //console.log('mainIterFrame');
    window.requestAnimationFrame(mainIterFrame);
};

// Mainloop-level debug-rendering

var TOGGLE_TIMER_SHOW = 'T'.charCodeAt(0);

main._doTimerShow = false;

main._debugRender = function (ctx) {
    
    if (eatKey(TOGGLE_TIMER_SHOW)) this._doTimerShow = !this._doTimerShow;
    
    if (!this._doTimerShow) return;
    
    var y = 350;
    ctx.fillText('FT ' + this._frameTime_ms, 50, y+10);
    ctx.fillText('FD ' + this._frameTimeDelta_ms, 50, y+20);
    ctx.fillText('UU ' + g_prevUpdateDu, 50, y+30); 
    ctx.fillText('FrameSync ON', 50, y+40);
};

main.init = function () {
    
    // Grabbing focus is good, but it sometimes screws up jsfiddle,
    // so it's a risky option during "development"
    //
    //window.focus(true);

    // We'll be working on a black background here,
    // so let's use a fillStyle which works against that...
    //
    //g_ctx.fillStyle = "white";
    console.log('main.init');
    
    gl = WebGLUtils.setupWebGL( g_canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, g_canvas.width, g_canvas.height );
    
    gl.clearColor( 0.4, 0.4, 0.4, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
	
	    // get models
    var PR = PlyReader();
    var plyData = PR.read("src/images/ground.ply");
    GroundVertices = plyData.points;
    GroundNormals = plyData.normals;
	plyData = PR.read("src/images/carrot.ply");
    car1Vertices = plyData.points;
    car1Normals = plyData.normals;
	plyData = PR.read("src/images/Brokoli.ply");
    car2Vertices = plyData.points;
    car2Normals = plyData.normals;
	plyData = PR.read("src/images/Tomato.ply");
    car3Vertices = plyData.points;
    car3Normals = plyData.normals;
	plyData = PR.read("src/images/Tomato.ply");
    car4Vertices = plyData.points;
    car4Normals = plyData.normals;
	plyData = PR.read("src/images/kidbody.ply");
    kid1Vertices = plyData.points;
    kid1Normals = plyData.normals;
	plyData = PR.read("src/images/kidshirt.ply");
    kid2Vertices = plyData.points;
    kid2Normals = plyData.normals;
	plyData = PR.read("src/images/donut.ply");
    kid3Vertices = plyData.points;
    kid3Normals = plyData.normals;
	plyData = PR.read("src/images/chocB.ply");
    floater1Vertices = plyData.points;
    floater1Normals = plyData.normals;
	plyData = PR.read("src/images/candy.ply");
    floater2Vertices = plyData.points;
    floater2Normals = plyData.normals;
	
	

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	treeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, treeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(spjaldVertices), gl.STATIC_DRAW );
    
	
		 // VBO for groundStuff
    groundBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, groundBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(GroundVertices), gl.STATIC_DRAW );
	
	groundNormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, groundNormalBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(GroundNormals), gl.STATIC_DRAW);
	
		 // VBO for All the Cars
    car1Buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER,car1Buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(car1Vertices), gl.STATIC_DRAW );
    
    car1NormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, car1NormalBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(car1Normals), gl.STATIC_DRAW);
	
	car2Buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER,car2Buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(car2Vertices), gl.STATIC_DRAW );
    
    car2NormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, car2NormalBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(car2Normals), gl.STATIC_DRAW);
	
	car3Buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER,car3Buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(car3Vertices), gl.STATIC_DRAW );
    
    car3NormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, car3NormalBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(car3Normals), gl.STATIC_DRAW);
	
	car4Buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER,car4Buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(car4Vertices), gl.STATIC_DRAW );
    
    car4NormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, car4NormalBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(car4Normals), gl.STATIC_DRAW);
	
	//floaters
	
	floater1Buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER,floater1Buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(floater1Vertices), gl.STATIC_DRAW );
	
	floater2Buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER,floater2Buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(floater2Vertices), gl.STATIC_DRAW );
	
	//and the kid
	

	kid1Buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER,kid1Buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(kid1Vertices), gl.STATIC_DRAW );

	kid2Buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER,kid2Buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(kid2Vertices), gl.STATIC_DRAW );

	kid3Buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER,kid3Buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(kid3Vertices), gl.STATIC_DRAW );


    // VBO for the cube
    cubeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cVertices), gl.STATIC_DRAW );
    
    cubeNormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeNormalBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cNormals), gl.STATIC_DRAW);

    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
	
	
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    nPosition = gl.getAttribLocation( program, "nPosition" );
    gl.vertexAttribPointer( nPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( nPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );
    
    mvLoc = gl.getUniformLocation( program, "modelview" );
    normalLoc = gl.getUniformLocation( program, "normal" )

    // set projection
    pLoc = gl.getUniformLocation( program, "projection" );
    proj = perspective( 50.0, 1.0, 1.0, 2000.0 );
    gl.uniformMatrix4fv(pLoc, false, flatten(proj));
    
    // Lighting
    
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct) );   
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininessBP"), materialShininess );
    
    
    //===================
    // Ná í mynd úr html-skrá:
    //
     var image = document.getElementById("texImage");

    var xIm = image.ImageData;
    util.configureTexture( image , program);
	
	gl.enable( gl.BLEND );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    //=======+===========
    // EVENT LISTENERS
    //===================
    
    window.addEventListener('keydown', function(evt) {
        switch( evt.keyCode ) {
            // Move camera (not for players)
            case keyCode('J'):
                cameraPos.x -= 5;
                lookAtPoint.x -= 5;
                break;
            case keyCode('L'):
                cameraPos.x += 5;
                lookAtPoint.x += 5;
                break;
            case keyCode('I'):
                cameraPos.z += 5;
                break;
            case keyCode('K'):
                cameraPos.z -= 5;
                break;
            case keyCode('U'):
                cameraPos.y -= 5;
                lookAtPoint.y -= 5;
                break;
            case keyCode('O'):
                cameraPos.y += 5;
                lookAtPoint.y += 5;
                break;
            case keyCode('G'):
                if (godView) {
                    godView  = false;
                    cameraPos = {
                        x : entityManager._character[0].x,
                        y : entityManager._character[0].y-110,
                        z : 70
                    }
                } else {
                    godView = true;
                    cameraPos = {
                        x : entityManager._character[0].x,
                        y : -400,
                        z : 830
                    };
                }
                break;
                
            // Move camera (for players)
            case keyCode('Q'):
                lookLeft = true;
                //console.log('Q');
                break;
            case keyCode('E'):
                lookRight = true;
                //console.log('E');
                break;
            case keyCode('R'):
                if (cameraPos.z < 600) cameraPos.z += 5;
                break;
            case keyCode('F'):
                if (cameraPos.z > 50) cameraPos.z -= 5;
                break;
                
            // Move character
            case keyCode('A'):
                if (!entityManager._character[0].isJumping) entityManager._character[0].moveLeft = true;
                break;
            case keyCode('D'):
                if (!entityManager._character[0].isJumping) entityManager._character[0].moveRight = true;
                break;
            case keyCode('W'):
                if (!entityManager._character[0].isJumping) entityManager._character[0].moveForward = true;
                break;
            case keyCode('S'):
                if (!entityManager._character[0].isJumping) entityManager._character[0].moveBackwards = true;
                break;
        }
    });
    
    window.addEventListener('keyup', function(evt) {
        switch (evt.keyCode) {
            // Camera logistics
            case keyCode('Q'):
                lookLeft = false;
                break;
            case keyCode('E'):
                lookRight = false;
                break;
                
           // Player logistics
           case keyCode('A'):
                entityManager._character[0].moveLeft = false;
                break;
            case keyCode('D'):
                entityManager._character[0].moveRight = false;
                break;
        }
    });
	
    
    
    this._requestNextIteration();
};


