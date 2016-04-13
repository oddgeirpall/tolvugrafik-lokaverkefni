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
var numKidVertices = 48;

var colorLoc;
var mvLoc;
var pLoc;
var proj;

var cubeBuffer;
var trackBuffer;
var roofBuffer;
var vPosition;
var groundBuffer;

var car3Buffer;
var car2Buffer;
var car1Buffer;
var car4Buffer;
var kidBuffer;

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

var g_laneHeight = 50;

// Camera location and lookat
var cameraPos = {
    x : 0.0,
    y : -360.0,
    z : 70.0
};

var lookAtPoint = {
    x : 0.0,
    y : 1.0,
    z : 0.0
}

var lookLeft = false;
var lookRight = false;

// Prevent spacebar from scrolling page, esp. when console is open.
window.onkeydown = function(e) {
	if(e.keyCode == " ".charCodeAt(0) || e.keyCode == 38 || e.keyCode == 40) e.preventDefault();
}