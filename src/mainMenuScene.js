var MainMenuLayer = cc.LayerColor.extend({
	_gameLogo: null,
	_pressX: null,

	initWithColor:function (color) {
		if(!this._super(color))
		{
			cc.log("MainMenuLayer's init() called failed.");
			return false;
		}

		var winSize = cc.Director.getInstance().getWinSize();

		// game logo
		this._gameLogo = cc.Sprite.create(res_gameLogo);
		this._gameLogo.setPosition(cc.p(winSize.width/2, winSize.height/1.8));
		this._gameLogo.setScale(2.0);
		this.addChild(this._gameLogo);

		// label to start the game
		this._pressX = cc.LabelTTF.create("Press X to play", "AtariClassic", 20);
		this._pressX.setColor(cc.c4b(255,255,255,255));
		this._pressX.setPosition(cc.p(winSize.width/2 - this._pressX.getContentSize().width/2 -12, winSize.height/4.5));
		var blink = cc.Blink.create(2.0, 3);
		var forever = cc.RepeatForever.create(blink);
		this._pressX.runAction(forever);
		this.addChild(this._pressX);

		this.setKeyboardEnabled(true);

		return true;
	},
	onKeyUp:function(e) {

	},
	onKeyDown:function(e) {
        // cycle through the available weapons
        if(e == cc.KEY.x)
        {
        	// stop current playing bgm
        	global.stopBackgroundMusic(true);

        	// play stage theme
        	global.playBackgroundMusic(res_stageThemeBGM, true);

            // transition to game session scene
            cc.Director.getInstance().replaceScene(new GameSessionScene());
        }
    },
});

var MainMenuScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		// play bgm
        global.playBackgroundMusic(res_mainThemeBGM, true);

		var layer = new MainMenuLayer();
		layer.initWithColor(cc.c4b(0,0,0,0));
		this.addChild(layer);
	}
});