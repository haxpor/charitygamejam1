var CreditsSettings = {
	FRAME_HEIGHT: 1500,
	SPEED: 1.0, // pixel per frame
	SLOW_SPEED: 0.5
}

var CreditsLayer = cc.LayerColor.extend({
	isMouseDown: false,

	_currentSpeed: 1.0,

	_basementDojoHeaderLabel: null,	// basement dojo header
	_coderHeaderLabel: null,
	_coderNameLabel: null,

	_artistHeaderLabel: null,
	_artistNameLabel: null,

	_specialThanksHeaderLabel: null,	// special thanks header
	_soundHeadLabel: null,
	_soundNameLabel: null,
	_soundLinkLabel: null,

	_basementDojoLogo: null,
	_basementDojoWebsiteLabel: null,
	_basementDojoEmailLabel: null,

	initWithColor:function (color) {
		if(!this._super(color))
		{
			global.log("CreditsLayer's init() called failed.");
			return false;
		}

		var winSize = cc.Director.getInstance().getWinSize();

		// init data
		this._currentSpeed = CreditsSettings.SPEED;

		// basement dojo section
		var upperY = 0;
		var spacing = 35;
		var bigSpacing = 60;

		// -- Basement Dojo --
		this._basementDojoHeaderLabel = cc.LabelTTF.create("- Basement Dojo -", "AtariClassic", 24);
		this._basementDojoHeaderLabel.setPosition(cc.p(winSize.width/2, - this._basementDojoHeaderLabel.getContentSize().height/2));
		this.addChild(this._basementDojoHeaderLabel);
		upperY = this._basementDojoHeaderLabel.getPositionY() - this._basementDojoHeaderLabel.getContentSize().height/2;

		// game design & monkey coder
		this._coderHeaderLabel = cc.LabelTTF.create("Game Design & Monkey Coder", "AtariClassic", 16);
		this._coderHeaderLabel.setColor(cc.c3b(128,128,128));
		this._coderHeaderLabel.setPosition(cc.p(winSize.width/2, upperY - spacing - this._coderHeaderLabel.getContentSize().height/2));
		this.addChild(this._coderHeaderLabel);
		upperY = this._coderHeaderLabel.getPositionY() - this._coderHeaderLabel.getContentSize().height/2;

		this._coderNameLabel = cc.LabelTTF.create("Wasin Thonkaew", "AtariClassic",  18);
		this._coderNameLabel.setPosition(cc.p(winSize.width/2, upperY - spacing/2 - this._coderNameLabel.getContentSize().height/2));
		this.addChild(this._coderNameLabel);
		upperY = this._coderNameLabel.getPositionY() - this._coderNameLabel.getContentSize().height/2;

		// elite artist
		this._artistHeaderLabel = cc.LabelTTF.create("Elite Artist", "AtariClassic", 16);
		this._artistHeaderLabel.setColor(cc.c3b(128,128,128));
		this._artistHeaderLabel.setPosition(cc.p(winSize.width/2, upperY - bigSpacing - this._artistHeaderLabel.getContentSize().height/2));
		this.addChild(this._artistHeaderLabel);
		upperY = this._artistHeaderLabel.getPositionY() - this._artistHeaderLabel.getContentSize().height/2;

		this._artistNameLabel = cc.LabelTTF.create("Suebphatt Leelertphong", "AtariClassic", 16);
		this._artistNameLabel.setPosition(cc.p(winSize.width/2, upperY - spacing/2 - this._artistNameLabel.getContentSize().height/2));
		this.addChild(this._artistNameLabel);
		upperY = this._artistNameLabel.getPositionY() - this._artistNameLabel.getContentSize().height/2;

		// -- Special Thanks --
		this._specialThanksHeaderLabel = cc.LabelTTF.create("- Special Thanks -", "AtariClassic", 24);
		this._specialThanksHeaderLabel.setPosition(cc.p(winSize.width/2, upperY - bigSpacing*3 - this._specialThanksHeaderLabel.getContentSize().height/2));
		this.addChild(this._specialThanksHeaderLabel);
		upperY = this._specialThanksHeaderLabel.getPositionY() - this._specialThanksHeaderLabel.getContentSize().height/2;

		// chip-tune sound brewer
		this._soundHeadLabel = cc.LabelTTF.create("Chip-tune Sound Brewer", "AtariClassic", 16);
		this._soundHeadLabel.setColor(cc.c3b(128,128,128));
		this._soundHeadLabel.setPosition(cc.p(winSize.width/2, upperY - spacing - this._soundHeadLabel.getContentSize().height/2));
		this.addChild(this._soundHeadLabel);
		upperY = this._soundHeadLabel.getPositionY() - this._soundHeadLabel.getContentSize().height/2;

		this._soundNameLabel = cc.LabelTTF.create("Narupai Asksonmee", "AtariClassic", 18);
		this._soundNameLabel.setPosition(cc.p(winSize.width/2, upperY - spacing/2 - this._soundNameLabel.getContentSize().height/2));
		this.addChild(this._soundNameLabel);
		upperY = this._soundNameLabel.getPositionY() - this._soundNameLabel.getContentSize().height/2;

		this._soundLinkLabel = cc.LabelTTF.create("soundcloud.com/user8503397", "AtariClassic", 12);
		this._soundLinkLabel.setPosition(cc.p(winSize.width/2, upperY - spacing/2 - this._soundLinkLabel.getContentSize().height/2));
		this._soundLinkLabel.setColor(cc.c3b(200,200,200));
		this.addChild(this._soundLinkLabel);
		upperY = this._soundLinkLabel.getPositionY() - this._soundLinkLabel.getContentSize().height/2;

		// -- Logo and Info --
		this._basementDojoLogo = cc.Sprite.create(res_creditsLogo);
		this._basementDojoLogo.setPosition(cc.p(winSize.width/2, upperY - bigSpacing*6.2 - this._basementDojoLogo.getContentSize().height/2));
		this.addChild(this._basementDojoLogo);
		upperY = this._basementDojoLogo.getPositionY() - this._basementDojoLogo.getContentSize().height/2;

		this._basementDojoWebsiteLabel = cc.LabelTTF.create("www.basementdojo.com", "AtariClassic", 16);
		this._basementDojoWebsiteLabel.setColor(cc.c3b(200,200,200));
		this._basementDojoWebsiteLabel.setPosition(cc.p(winSize.width/2, upperY - spacing - this._basementDojoWebsiteLabel.getContentSize().height/2));
		this.addChild(this._basementDojoWebsiteLabel);
		upperY = this._basementDojoWebsiteLabel.getPositionY() - this._basementDojoWebsiteLabel.getContentSize().height/2;

		this._basementDojoEmailLabel = cc.LabelTTF.create("contact@basementdojo.com", "AtariClassic", 16);
		this._basementDojoEmailLabel.setColor(cc.c3b(200,200,200));
		this._basementDojoEmailLabel.setPosition(cc.p(winSize.width/2, upperY - spacing/2 - this._basementDojoEmailLabel.getContentSize().height/2));
		this.addChild(this._basementDojoEmailLabel);

		this.setTouchEnabled(true);
		this.setKeyboardEnabled(true);
		this.scheduleUpdate();

		return true;
	},
	update:function(dt) {
		// transition up
		this._basementDojoHeaderLabel.setPositionY((this._basementDojoHeaderLabel.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
		this._coderHeaderLabel.setPositionY((this._coderHeaderLabel.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
		this._coderNameLabel.setPositionY((this._coderNameLabel.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
		this._artistHeaderLabel.setPositionY((this._artistHeaderLabel.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
		this._artistNameLabel.setPositionY((this._artistNameLabel.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
		this._specialThanksHeaderLabel.setPositionY((this._specialThanksHeaderLabel.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
		this._soundHeadLabel.setPositionY((this._soundHeadLabel.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
		this._soundNameLabel.setPositionY((this._soundNameLabel.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
		this._soundLinkLabel.setPositionY((this._soundLinkLabel.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
		this._basementDojoLogo.setPositionY((this._basementDojoLogo.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
		this._basementDojoWebsiteLabel.setPositionY((this._basementDojoWebsiteLabel.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
		this._basementDojoEmailLabel.setPositionY((this._basementDojoEmailLabel.getPositionY() + this._currentSpeed) % CreditsSettings.FRAME_HEIGHT);
	},
	onTouchesBegan:function (touches, event) {
		this.isMouseDown = true;

		this._currentSpeed = CreditsSettings.SLOW_SPEED;
	},
	onTouchesMoved:function (touches, event) {

	},
	onTouchesEnded:function (touches, event) {
		this.isMouseDown = false;

		this._currentSpeed = CreditsSettings.SPEED;
	},
	onTouchesCancelled:function (touches, event) {
		this.isMouseDown = false;
	},
	onKeyUp:function(e) {

	},
	onKeyDown:function(e) {
		if(e == cc.KEY.x || e == cc.KEY.enter || e == cc.KEY.space)
		{
			// unschedule udpate
			this.unscheduleUpdate();

			// go back to main menu scene
			cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.0, new MainMenuScene()));
		}
	}
});

var CreditsScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		var layer = new CreditsLayer();
        layer.initWithColor(cc.c4b(0,0,0,0));
        this.addChild(layer);
	}
});