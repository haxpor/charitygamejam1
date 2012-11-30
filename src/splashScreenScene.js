var SplashScreenLayer = cc.LayerColor.extend({
	initWithColor:function(color) {
		if(!this._super(color))
		{
			global.log("SplashScreenLayer's init() called failed.");
			return false;
		}

		var winSize = cc.Director.getInstance().getWinSize();

		var logo = cc.Sprite.create(res_splashLogo);
		logo.setPosition(cc.p(winSize.width/2 + 5, winSize.height/2));
		logo.runAction(cc.Sequence.create(
			cc.DelayTime.create(3.0),
			cc.CallFunc.create(this, this._transitionToMainMenuScene)));
		this.addChild(logo);

		return true;
	},
	_transitionToMainMenuScene:function () {
		cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.0, new MainMenuScene()));
	}
});

var SplashScreenScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		var layer = new SplashScreenLayer();
        layer.initWithColor(cc.c4b(0,0,0,0));
        this.addChild(layer);
	}
});