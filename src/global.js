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