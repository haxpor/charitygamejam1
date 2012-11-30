var CreditLayer = cc.LayerColor.extend({
	initWithColor:function (color) {
		if(!this._super(color))
		{
			global.log("CreditLayer's init() called failed.");
			return false;
		}



		return true;
	}
});

var CreditScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		var layer = new CreditLayer();
        layer.initWithColor(cc.c4b(0,0,0,0));
        this.addChild(layer);
	}
});