var GameSessionLayer = cc.Layer.extend({
    isMouseDown:false,
    _mc:null,

    init:function () {

        if(!this._super())
        {
            cc.log("GameSessionLayer's init() called error failed.");
            return false;
        }

        var winSize = cc.Director.getInstance().getWinSize();

        var layout = cc.Sprite.create(res_testLayout);
        layout.setPosition(cc.p(winSize.width/2, winSize.height/2));
        this.addChild(layout, -10);

        // add test character
        this._mc = MainCharacter.create();
        this._mc.setPosition(cc.p(winSize.width * 0.8, winSize.height/2 - 32));
        this._mc.addSelfToNode(this);

        this.setTouchEnabled(true);
        return true;
    },

    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;

        // shoot

        // update the rotation of weapon
        if(touches)
            this._mc.updateWeaponRotationFrom(touches[0].getLocation());
    },
    onTouchesMoved:function (touches, event) {
        if(this.isMouseDown)
        {
            // shoot
        }

        // update the rotation of weapon
        if(touches)
            this._mc.updateWeaponRotationFrom(touches[0].getLocation());
    },
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
    },
    onTouchesCancelled:function (touch, event) {
    }
});

var GameSessionScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameSessionLayer();
        layer.init();
        this.addChild(layer);
    }
});

