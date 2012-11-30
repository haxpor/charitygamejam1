var DieUILayer = cc.LayerColor.extend({
	_waveNo: -1,
	_zombiesKilled: -1,

	initWith:function (color, waveNo, zombiesKilled) {
		if(!this.initWithColor(color))
		{
			global.log("DieUILayer's init() called failed.");
			return false;
		}

		// set data
		this._waveNo = waveNo;
		this._zombiesKilled = zombiesKilled;

		// fade in backdrop
		var sequence = cc.Sequence.create(
			cc.FadeTo.create(1.0, 128),
			cc.CallFunc.create(this, this.showUIElements)
		);
		this.runAction(sequence);
		
		return true;
	},
	showUIElements:function() {
		var winSize = cc.Director.getInstance().getWinSize();

		// labels
		var youDieLabel = cc.LabelTTF.create("You Died!", "AtariClassic", 40);
		youDieLabel.setColor(cc.c3b(255,0,0));
		youDieLabel.setPosition(
			cc.p(winSize.width/2,
				 winSize.height/1.5 - youDieLabel.getContentSize().height/2)
			);
		this.addChild(youDieLabel);

		var waveLabel = cc.LabelTTF.create("Wave: " + this._waveNo, "AtariClassic", 18);
		waveLabel.setColor(cc.c3b(255,255,255));
		waveLabel.setPosition(
			cc.p(
				winSize.width/2,
				youDieLabel.getPositionY() - youDieLabel.getContentSize().height/2 - 20 - waveLabel.getContentSize().height/2)
			);
		this.addChild(waveLabel);

		var zombiesKilledLabel = cc.LabelTTF.create("Z-Killed: " + this._zombiesKilled, "AtariClassic", 18);
		zombiesKilledLabel.setColor(cc.c3b(255,255,255));
		zombiesKilledLabel.setPosition(
			cc.p(
				winSize.width/2,
				waveLabel.getPositionY() - waveLabel.getContentSize().height/2 - 20 - zombiesKilledLabel.getContentSize().height/2)
			);
		this.addChild(zombiesKilledLabel);

		// menu
		var restartGameLabel = cc.LabelTTF.create("Press X to restart", "AtariClassic", 20);
		restartGameLabel.setColor(cc.c3b(255,255,255));
		restartGameLabel.setPosition(
			cc.p(
				winSize.width/2, 
				winSize.height/4.5));
		var blink = cc.Blink.create(2.0, 3);
		var forever = cc.RepeatForever.create(blink);
		restartGameLabel.runAction(forever);
		this.addChild(restartGameLabel);

		this.setKeyboardEnabled(true);

		var menu = cc.Menu.create()
	},
	onKeyUp:function (e) {

	},
	onKeyDown:function (e) {
		if(e == cc.KEY.x)
		{
			// reset everything
			this.getParent().restartGame();
		}
	}
});

DieUILayer.create = function(waveNo, zombiesKilled) {
	var die = new DieUILayer();
	if(die && die.initWith(cc.c4b(30,30,30,0), waveNo, zombiesKilled))
	{
		return die;
	}
	else
	{
		die = null;
		return null;
	}
}