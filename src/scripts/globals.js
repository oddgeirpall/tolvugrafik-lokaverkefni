// =======
// GLOBALS
// =======
/*

Evil, ugly (but "necessary") globals, which everyone can use.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("gl-canvas");
//var g_ctx = g_canvas.getContext("2d");

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;
var NOMINAL_GRAVITY = 0.52;
var TERMINAL_VELOCITY = 10.5;


// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;

// Buffers
var numCubeVertices = 36;
var numRoofVertices = 9;
var numGroundVertices = 240;
var numCar1Vertices = 90;
var numCar2Vertices = 138;
var numCar3Vertices = 321;
var numCar4Vertices = 321;
var numKidVertices = 876;
var numTreVertices  = 6;

var texture;
var colorLoc;
var mvLoc;
var normalLoc;
var pLoc;
var proj;

var vPosition;
var nPosition;
var kPosition;
var c1Position;
var c2Position;
var c3Position;
var c4Position;
var wPosition;
var groundBuffer;
var treeBuffer;

var vTexCoord;

var image;

var cubeBuffer;
var groundBuffer
var car1Buffer;
var car2Buffer;
var car3Buffer;
var car4Buffer;
var kidBuffer;

var cubeNormalBuffer;
var groundNormalBuffer;
var car1NormalBuffer;
var car2NormalBuffer;
var car3NormalBuffer;
var car4NormalBuffer;
var kidNormalBuffer;

var gl;

var GroundVertices = [];
var GroundNormals = [];
var car1Vertices = [];
var car1Normals = [];
var car2Vertices = [];
var car2Normals = [];
var car3Vertices = [];
var car3Normals = [];
var car4Vertices = [];
var car4Normals = [];
var kidVertices = [];
var kidNormals = [];

// Lighting

var lightPosition = vec4( 1000.0, 0.0, 1000.0, 0.0);
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 1000.0;

var ambientProduct, diffuseProduct, specularProduct;

// Matrices
var g_renderMatrix;

// Verctices
var cVertices = [
    // front side:
    vec3( -0.5,  0.5,  0.5 ), vec3( -0.5, -0.5,  0.5 ), vec3(  0.5, -0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ), vec3(  0.5,  0.5,  0.5 ), vec3( -0.5,  0.5,  0.5 ),
    // right side:
    vec3(  0.5,  0.5,  0.5 ), vec3(  0.5, -0.5,  0.5 ), vec3(  0.5, -0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ), vec3(  0.5,  0.5,  0.5 ),
    // bottom side:
    vec3(  0.5, -0.5,  0.5 ), vec3( -0.5, -0.5,  0.5 ), vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5, -0.5, -0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3(  0.5, -0.5,  0.5 ),
    // top side:
    vec3(  0.5,  0.5, -0.5 ), vec3( -0.5,  0.5, -0.5 ), vec3( -0.5,  0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ), vec3(  0.5,  0.5,  0.5 ), vec3(  0.5,  0.5, -0.5 ),
    // back side:
    vec3( -0.5, -0.5, -0.5 ), vec3( -0.5,  0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 ),
    // left side:
    vec3( -0.5,  0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 ), vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5,  0.5 ), vec3( -0.5,  0.5,  0.5 ), vec3( -0.5,  0.5, -0.5 )
];

var cNormals = [ // Cube normals
    // Front side
    vec3( 0.0, 0.0, 1.0), vec3( 0.0, 0.0, 1.0), vec3( 0.0, 0.0, 1.0),
    vec3( 0.0, 0.0, 1.0), vec3( 0.0, 0.0, 1.0), vec3( 0.0, 0.0, 1.0),
    
    // Right side
    vec3( 1.0, 0.0, 0.0), vec3( 1.0, 0.0, 0.0), vec3( 1.0, 0.0, 0.0),
    vec3( 1.0, 0.0, 0.0), vec3( 1.0, 0.0, 0.0), vec3( 1.0, 0.0, 0.0),
    
    // Bottom side
    vec3( 0.0, -1.0, 0.0), vec3( 0.0, -1.0, 0.0), vec3( 0.0, -1.0, 0.0),
    vec3( 0.0, -1.0, 0.0), vec3( 0.0, -1.0, 0.0), vec3( 0.0, -1.0, 0.0),
    
    // Top side
    vec3( 0.0, 1.0, 0.0), vec3( 0.0, 1.0, 0.0), vec3( 0.0, 1.0, 0.0),
    vec3( 0.0, 1.0, 0.0), vec3( 0.0, 1.0, 0.0), vec3( 0.0, 1.0, 0.0),
    
    // Back side
    vec3( 0.0, 0.0, -1.0), vec3( 0.0, 0.0, -1.0), vec3( 0.0, 0.0, -1.0),
    vec3( 0.0, 0.0, -1.0), vec3( 0.0, 0.0, -1.0), vec3( 0.0, 0.0, -1.0),
    
    // Left side
    vec3( -1.0, 0.0, 0.0), vec3( -1.0, 0.0, 0.0), vec3( -1.0, 0.0, 0.0),
    vec3( -1.0, 0.0, 0.0), vec3( -1.0, 0.0, 0.0), vec3( -1.0, 0.0, 0.0)
];

var g_laneHeight = 50;

// Mynsturhnit fyrir spjaldið
var texCoords = [
    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 )
];

// Tveir þríhyrningar sem mynda spjald í z=0 planinu
var spjaldVertices = [
    vec4( -1.0, -1.0, 0.0, 1.0 ),
    vec4(  1.0, -1.0, 0.0, 1.0 ),
    vec4(  1.0,  1.0, 0.0, 1.0 ),
    vec4(  1.0,  1.0, 0.0, 1.0 ),
    vec4( -1.0,  1.0, 0.0, 1.0 ),
    vec4( -1.0, -1.0, 0.0, 1.0 )
];

// Camera location and lookat
var cameraPos = {
    x : 0.0,
    y : 250.0,
    z : 70.0,
    startPos : function() {
        this.x = 0.0;
        this.y = 350.0;
        this.z = 70.0;
    }
};

var lookAtPoint = {
    x : 0.0,
    y : 1.0,
    z : 0.0,
    reset : function() {
        this.x = 0.0;
        this.y = 1.0;
        this.z = 0.0;
    },
    startPos : function() {
        this.x = 0.0;
        this.y = 500.0;
        this.z = 0.0;
    } 
}

var lookLeft = false;
var lookRight = false;

// Prevent spacebar from scrolling page, esp. when console is open.
window.onkeydown = function(e) {
	if(e.keyCode == " ".charCodeAt(0) || e.keyCode == 38 || e.keyCode == 40) e.preventDefault();
}

// Other

var backgroundMusic;
var godView = false;
var zooming = false;
var program;