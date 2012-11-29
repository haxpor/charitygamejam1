var HudLayer = cc.Layer.extend({
	// data
	_waveNo:-1,
	_timeLeftForNextWave:-1,
	_mcHP:-1,

	// labels
	_waveNoLabel:null,
	_timeLeftForNextWaveLabel:null,
	_mcHPLabel:null,

	initWith:function(initWaveNo, initTimeLeftForNextWave, initMcHP) {
		if(!this.init())
		{
			global.log("HudLayer's init() called failed.");
			return false;
		}

		var winSize = cc.Director.getInstance().getWinSize();

		// init data
		this._waveNo = initWaveNo;
		this._timeLeftForNextWave = initTimeLeftForNextWave;
		this._mcHP = initMcHP;

		// wave no
		this._waveNoLabel = cc.LabelTTF.create("Wave " + this._waveNo, "AtariClassic", 30);
		this._waveNoLabel.setColor(cc.c4b(70,70,70,255));
		this._waveNoLabel.setPosition(
			cc.p(winSize.width/2,
				 winSize.height - 42));
		this.addChild(this._waveNoLabel);

		// time left til next wave
		this._timeLeftForNextWaveLabel = cc.LabelTTF.create(
			parseFloat(Math.round(this._timeLeftForNextWave * 100) / 100).toFixed(2), "AtariClassic", 10);
		this._timeLeftForNextWaveLabel.setColor(cc.c4b(80,80,80,255));
		this._timeLeftForNextWaveLabel.setPosition(
			cc.p(winSize.width/2 + this._waveNoLabel.getContentSize().width - this._timeLeftForNextWaveLabel.getContentSize().width,
				 winSize.height - 42 + this._timeLeftForNextWaveLabel.getContentSize().height/2));
		this.addChild(this._timeLeftForNextWaveLabel);

		// mc's hp
		this._mcHPLabel = cc.LabelTTF.create(this._mcHP, "AtariClassic", 10);
		this._mcHPLabel.setColor(cc.c4b(80,80,80,255));
		this._mcHPLabel.setPosition(
			cc.p(winSize.width/2 + this._waveNoLabel.getContentSize().width - this._mcHPLabel.getContentSize().width -
				 + 10,
				 winSize.height - 42 + this._mcHPLabel.getContentSize().height/2 -
				 this._timeLeftForNextWaveLabel.getContentSize().height));
		this.addChild(this._mcHPLabel);

		return true;
	},
	updateWith:function(waveNo, timeLeftForNextWave, mcHP) {
		if(waveNo != this._waveNo)
		{
			this._waveNo = waveNo;

			this._waveNoLabel.setString("Wave " + this._waveNo);
			// reposition to the left a bit for beauty
			if(this._waveNo > 9)
			{
				this._waveNoLabel.setPositionX(cc.Director.getInstance().getWinSize().width/2 - 9);
			}
		}
		if(timeLeftForNextWave != this._timeLeftForNextWave)
		{
			this._timeLeftForNextWave = timeLeftForNextWave;

			this._timeLeftForNextWaveLabel.setString(
				parseFloat(Math.round(this._timeLeftForNextWave * 100) / 100).toFixed(2))
		}
		if(mcHP != this._mcHP)
		{
			this._mcHP = mcHP;

			this._mcHPLabel.setString(this._mcHP);
		}
	}
});

HudLayer.create = function(initWaveNo, initTimeLeftForNextWave, initMcHP) {
	var hud = new HudLayer();
	if(hud && hud.initWith(initWaveNo, initTimeLeftForNextWave, initMcHP))
	{
		return hud;
	}
	else
	{
		hud = null;
		return null;
	}
}