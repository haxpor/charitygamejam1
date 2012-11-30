var MainMenuText = {
	PLAY_NORMAL: "Play",
	PLAY_SELECT: "- Play -",
	CREDIT_NORMAL: "Credits",
	CREDIT_SELECT: "- Credits -"
}

var MainMenuLayer = cc.LayerColor.extend({
	_gameLogo: null,
	_pressX: null,
	_pressY: null,
	_currentChoice: 1,

	initWithColor:function (color) {
		if(!this._super(color))
		{
			cc.log("MainMenuLayer's init() called failed.");
			return false;
		}

		var winSize = cc.Director.getInstance().getWinSize();

		// init data
		this._currentChoice = 1;

		// game logo
		this._gameLogo = cc.Sprite.create(res_gameLogo);
		this._gameLogo.setPosition(cc.p(winSize.width/2, winSize.height/1.8));
		this._gameLogo.setScale(2.0);
		this.addChild(this._gameLogo);

		// label to start the game
		this._pressX = cc.LabelTTF.create(MainMenuText.PLAY_SELECT, "AtariClassic", 18);
		this._pressX.setColor(cc.c4b(255,255,255,255));
		this._pressX.setPosition(cc.p(winSize.width/2, winSize.height/4));
		var blink = cc.Blink.create(2.0, 3);
		var forever = cc.RepeatForever.create(blink);
		this._pressX.runAction(forever);
		this.addChild(this._pressX);

		this._pressY = cc.LabelTTF.create(MainMenuText.CREDIT_NORMAL, "AtariClassic", 18);
		this._pressY.setColor(cc.c4b(255,255,255,255));
		this._pressY.setPosition(cc.p(winSize.width/2, winSize.height/5.2));
		this.addChild(this._pressY);

		this.setKeyboardEnabled(true);

		return true;
	},
	onKeyUp:function(e) {

	},
	onKeyDown:function(e) {
        // cycle through the available weapons
        if(e == cc.KEY.x || e == cc.KEY.enter || e == cc.KEY.space)
        {
        	// play the game
        	if(this._currentChoice == 1)
        	{
        		// stop current playing bgm
	        	global.stopBackgroundMusic(true);

	        	// play stage theme
	        	global.playBackgroundMusic(res_stageThemeBGM, true);

	            // transition to game session scene
	            cc.Director.getInstance().replaceScene(new GameSessionScene());
        	}
        	// see credits
        	else if(this._currentChoice == 2)
        	{
	        	// transition to credits
	        	cc.Director.getInstance().replaceScene(new CreditsScene());
	        }
        }
        else if(e == cc.KEY.up && this._currentChoice == 2)
        {
        	var winSize = cc.Director.getInstance().getWinSize();

        	this._currentChoice = 1;

        	// stop 2nd choice's blinking
        	this._pressY.stopAllActions();
        	this._pressY.setVisible(true);
        	this._pressY.setString(MainMenuText.CREDIT_NORMAL);
        	this._pressY.setPositionX(winSize.width/2);

        	// blink up 1st choice
        	var blink = cc.Blink.create(2.0, 3);
			var forever = cc.RepeatForever.create(blink);
			this._pressX.runAction(forever);
			this._pressX.setString(MainMenuText.PLAY_SELECT);
			this._pressX.setPositionX(winSize.width/2);
        }
        else if(e == cc.KEY.down && this._currentChoice == 1)
        {
        	var winSize = cc.Director.getInstance().getWinSize();

        	this._currentChoice = 2;

        	// stop 1st choice's blinking
        	this._pressX.stopAllActions();
        	this._pressX.setVisible(true);
        	this._pressX.setString(MainMenuText.PLAY_NORMAL);
        	this._pressX.setPositionX(winSize.width/2);

        	// blink up 2nd choice
        	var blink = cc.Blink.create(2.0, 3);
			var forever = cc.RepeatForever.create(blink);
			this._pressY.runAction(forever);
			this._pressY.setString(MainMenuText.CREDIT_SELECT);
			this._pressY.setPositionX(winSize.width/2);
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