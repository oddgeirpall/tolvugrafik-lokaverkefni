// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {

// RESETS
// ======

resetEntityManager: function(){
	//stuff to reset
},



// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
        if (value < lowBound) {
    	value = lowBound;
    } else if (value > highBound) {
	value = highBound; 
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},


// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},


// MISC
// ====

square: function(x) {
    return x*x;
},

sumFirst: function(num, array){
    var sum = 0;
    for(var i=0; i< min(num,array.length) ; i++){
        sum += array[i];
    }
    return sum;
},


// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},


// CANVAS OPS
// ==========


// Draw helper functions? 

//=======
// AUDIO
//=======

play: function (audio) {
    audio.pause();
    audio.currentTime = 0;
    if (!g_isMuted) audio.play();
},

playLoop: function (audio) {
    backgroundMusic.pause();
    backgroundMusic = audio;
	backgroundMusic.volume = Math.min(backgroundMusic.volume,0.5);
    backgroundMusic.currentTime = 0;
    if (!g_isMuted) {
        try {
            backgroundMusic.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            });
            backgroundMusic.play();
        } catch(err) {}
    };
}

};
