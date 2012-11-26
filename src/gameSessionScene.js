var GameSessionLayer = cc.LayerColor.extend({
    isMouseDown:false,
    _mc:null,

    initWithColor:function (color) {

        if(!this._super(color))
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
        this.setKeyboardEnabled(true);
        return true;
    },

    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;

        // update the rotation of weapon
        if(touches)
            this._mc.updateWeaponRotationFrom(touches[0].getLocation());

        // shoot
        this._mc.shoot(this);
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
    },

    onKeyUp:function(e) {

    },
    onKeyDown:function(e) {
        if(e == cc.KEY.x)
        {
            // cycle through weapon
            if(this._mc.currentWeapon == MainCharacterWeapon.MINIGUN)
            {
                this._mc.changeWeaponTo(MainCharacterWeapon.SHOTGUN);
            }
            else if(this._mc.currentWeapon == MainCharacterWeapon.SHOTGUN)
            {
                this._mc.changeWeaponTo(MainCharacterWeapon.MINIGUN);
            }
        }
    }
});

var GameSessionScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameSessionLayer();
        layer.initWithColor(new cc.Color4B(0,0,0,0));
        this.addChild(layer);
    }
});

