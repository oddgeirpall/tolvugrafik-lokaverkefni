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
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
	
	    // get models
    var PR = PlyReader();
    var plyData = PR.read("src/images/ground.ply");

    GroundVertices = plyData.points;
    GroundNormals = plyData.normals;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	
		 // VBO for groundStuff
    groundBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, groundBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(GroundVertices), gl.STATIC_DRAW );
	
	
    // VBO for the cube
    cubeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cVertices), gl.STATIC_DRAW );

	
	
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );
    
    mvLoc = gl.getUniformLocation( program, "modelview" );

    // set projection
    pLoc = gl.getUniformLocation( program, "projection" );
    proj = perspective( 50.0, 1.0, 1.0, 2000.0 );
    gl.uniformMatrix4fv(pLoc, false, flatten(proj));
    
    
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
        }
    });
    
    window.addEventListener('keyup', function(evt) {
        lookLeft = false;
        lookRight = false;
    });
    
    
    this._requestNextIteration();
};
