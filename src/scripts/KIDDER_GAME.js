// ==========================
// Kidder - A "frogger" game
// ==========================


"use strict";

/* jshint browser: true, devel: true, globalstrict: true */


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
    if (g_newGame) {
        g_newGame = false;
        initLevel();
        cameraPos.startPos();
        lookAtPoint.startPos();
    }
    if (!g_gameStarted) {
        if (eatKey(KEY_SPACE)) zooming = true;
        if (zooming) {
            cameraPos.y -= 10;          
        }
        if (cameraPos.y === -360) {
            g_gameStarted = true;
        } 
    }
    
    
    var char = entityManager._character[0];
    var world = entityManager._world[0];
    var lvl = entityManager._level
    
    if (char.y > world.startingLoc + (2+(lvl+2)*2)*g_laneHeight) {
        entityManager.enterLevel(lvl+1);
    }
    
    
    
    //console.log(lookAtPoint.x);
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
var g_newGame = true;
var g_gameStarted = false;


function renderSimulation() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    g_renderMatrix = mat4();
    g_renderMatrix = lookAt( vec3(cameraPos.x, cameraPos.y, cameraPos.z), vec3(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z), vec3(0.0, 0.0, 1.0) );

    entityManager.render();
};


// =============
// PRELOAD STUFF
// =============

var g_images = {};
var g_audio = {};
var backgroundMusic;

function requestPreloads() {
    console.log('requestPreloads');
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
        MainTheme: 'src/audios/LOTRtheme.ogg'
    }
    audioPreload(requiredAudio, g_audio, preloadDone);
};

function preloadDone() {
	//g_sprites.redBull = new Sprite(g_images.redBull);
    
    //g_audio.theme1.volume = 0.8;
    //g_audio.coin.volume = 0.7;
    
    //menuScreen = g_sprites.menuBar;
    console.log('preloadDone');
    main.init();
    
    //backgroundMusic = g_audio.theme2;
    //util.playLoop(g_audio.theme2);
    
};

function initLevel() {

    console.log('initLevel');
    entityManager.enterLevel(1);
    
    //backgroundMusic.pause();
	
    backgroundMusic = g_audio.MainTheme;
    util.playLoop(g_audio.MainTheme);
};

// Kick it off
requestPreloads();