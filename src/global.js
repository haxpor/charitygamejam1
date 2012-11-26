// Global settings and Functions
var global = {
	// Settings
	debug:1,
	music:1,
	sfx:1,

	// Functions (mostly wrapper and utillities)
	log:function (msg) {
		if(global.debug == 1)
			cc.log(msg);
	},
	playBackgroundMusic:function (path, isLoop) {
		if(global.music == 1)
			cc.AudioEngine.getInstance().playBackgroundMusic(path, isLoop);
	},
	playEffect:function (path) {
		if(global.sfx == 1)
		{
			var soundId = cc.AudioEngine.getInstance().playEffect(path);
			return soundId;
		}
	}
};

// Math utilities
var gmath = {
	randomDirectionValue:function() {
		var dir = 1.0;
		if(Math.random() > 0.5)
			dir = -1.0;

		return dir;
	},
	// random [min, max]
	randomBetween:function(min, max) {
		return min + Math.random() * (max-min);
	},
	// Input is cc.Point
	getLengthFrom:function(vec1, vec2) {
		return Math.sqrt( Math.pow(vec1.x - vec2.x, 2), Math.pow(vec1.y - vec2.y, 2));
	}
}