// ==========================
// Kidder - A "frogger" game
// ==========================


"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// =================
// UPDATE SIMULATION
// =================


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    /*
    if (g_menuScreenOn) {
		menuScreen = g_sprites.menuBar;
        if (eatKey(KEY_SPACE)) {
			g_menuScreenOn = false;
			if(g_firstTry){
				g_firstTry = false;
				g_textScreenOn = true;
				menuScreen = g_sprites.textScreen1;
			} else {
				g_newGame = false;
				initLevel();
			}
        }
		return;
    }
    */
    entityManager.update(du); 

}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_renderSpatialDebug = false;
var g_isMuted = false;

var KEY_MUTE  = keyCode('M');
var KEY_SPACE = keyCode(' ');

var KEY_RESET = keyCode('R');

// hér má bæta við lykklum fyrir tests ásamt falli fyrir neðan 
// í Diagnostics svosem "spawna óvin"

function processDiagnostics() {
    if (eatKey(KEY_MUTE)) {
        if (g_isMuted) {
            backgroundMusic.play();
        } else {
            backgroundMusic.pause();
        }
		g_isMuted = !g_isMuted;
    };
}


// =================
// RENDER SIMULATION
// =================

// GAME-SPECIFIC RENDERING
function renderSimulation(ctx) {
    entityManager.render();
};


// =============
// PRELOAD STUFF
// =============

var g_images = {};
var g_audio = {};
var backgroundMusic;

function requestPreloads() {

    var requiredImages = {
		//image paths
    };

    imagesPreload(requiredImages, g_images, imagePreloadDone);
};

var g_sprites = {};
var g_animations = {};

function makeZeldaAnimation(scale) {
    /*
	var zelda = {};
    zelda.walkingRight = new Animation(g_images.zeldaSpriteSheet,0,30,42,10,100, scale);
    zelda.walkingLeft = new Animation(g_images.zeldaSpriteSheet,0,30,42,10,100,-scale);
    zelda.runningRight = new Animation(g_images.zeldaSpriteSheet,44,33,43,4,100, scale);
    zelda.runningLeft = new Animation(g_images.zeldaSpriteSheet,44,33,43,4,100,-scale);
    zelda.inAirRight = new Animation(g_images.zeldaSpriteSheet,89,31,44,2,100,scale);
    zelda.inAirLeft = new Animation(g_images.zeldaSpriteSheet,89,31,44,2,100,-scale);
    zelda.idleRight = new Animation(g_images.zeldaSpriteSheet,510,19,42,1,1,scale);
    zelda.idleLeft = new Animation(g_images.zeldaSpriteSheet,510,19,42,1,1,-scale);
    zelda.magicRight = new Animation(g_images.zeldaSpriteSheet,320,51,48,6,100,scale);
    zelda.magicLeft = new Animation(g_images.zeldaSpriteSheet,320,51,48,6,100,-scale);

    return zelda;
	*/
};

function imagePreloadDone() {
    var requiredAudio = {
		//patRedB: "res/sounds/Patt_redBull.ogg",
    }
    audioPreload(requiredAudio, g_audio, preloadDone);
};

function preloadDone() {
	//g_sprites.redBull = new Sprite(g_images.redBull);
    
    //g_audio.theme1.volume = 0.8;
    //g_audio.coin.volume = 0.7;
    
    //menuScreen = g_sprites.menuBar;
    
    main.init();
    
    //backgroundMusic = g_audio.theme2;
    //util.playLoop(g_audio.theme2);
    
};

function initLevel() {

    entityManager.enterLevel(1);
    
    g_lvlLength = entityManager._world[0].blocks[13].length*(g_canvas.height/14) - g_canvas.width;
    
    backgroundMusic.pause();
	
	g_audio.theme1.volume=0.1;
    util.playLoop(g_audio.theme1);
};

// Kick it off
requestPreloads();