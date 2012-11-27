var GameSessionLayer = cc.LayerColor.extend({
    isMouseDown:false,
    _mc:null,
    _ground1:null,
    _ground2:null,
    _sky:null,
    _building1:null,
    _building2:null,
    _cloudFront1:null,
    _cloudFront2:null,
    _cloudBehind1:null,
    _cloudBehind2:null,

    zombies:null,

    initWithColor:function (color) {

        if(!this._super(color))
        {
            cc.log("GameSessionLayer's init() called error failed.");
            return false;
        }

        var winSize = cc.Director.getInstance().getWinSize();

        // init
        this.zombies = [];

        // background
        this._sky = cc.Sprite.create(res_sky);
        this._sky.setAnchorPoint(cc.p(0.0,1.0));
        this._sky.setPosition(cc.p(0, winSize.height));
        this.addChild(this._sky, -1);

        this._ground1 = cc.Sprite.create(res_ground);
        this._ground1.setAnchorPoint(cc.p(0.0,1.0));
        this._ground1.setPosition(cc.p(0, winSize.height-64));
        var sequence1 = cc.Sequence.create(
            cc.MoveBy.create(0.02, cc.p(-5,0)),
            cc.CallFunc.create(this, this.resetPositionLoopableNode, this._ground1));
        var moveGround1 = cc.RepeatForever.create(sequence1);
        this._ground1.runAction(moveGround1);
        this.addChild(this._ground1, -1);

        this._ground2 = cc.Sprite.create(res_ground);
        this._ground2.setAnchorPoint(cc.p(0.0,1.0));
        this._ground2.setPosition(cc.p(winSize.width, winSize.height-64));
        var sequence2 = cc.Sequence.create(
            cc.MoveBy.create(0.02, cc.p(-5,0)),
            cc.CallFunc.create(this, this.resetPositionLoopableNode, this._ground2));
        var moveGround2 = cc.RepeatForever.create(sequence2);
        this._ground2.runAction(moveGround2);
        this.addChild(this._ground2, -1);

        // parallax objects (do it manually)
        // - cloud behind
        this._cloudBehind1 = cc.Sprite.create(res_cloudBehind);
        this._cloudBehind1.setAnchorPoint(cc.p(0.0, 1.0));
        this._cloudBehind1.setPosition(cc.p(0, winSize.height-6));
        this._cloudBehind1.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                cc.MoveBy.create(0.4, cc.p(-4,0)),
                cc.CallFunc.create(this, this.resetPositionLoopableNode, this._cloudBehind1)
            ))
        );
        this.addChild(this._cloudBehind1, -1);

        this._cloudBehind2 = cc.Sprite.create(res_cloudBehind);
        this._cloudBehind2.setAnchorPoint(cc.p(0.0, 1.0));
        this._cloudBehind2.setPosition(cc.p(478, winSize.height-6));
        this._cloudBehind2.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                cc.MoveBy.create(0.4, cc.p(-4,0)),
                cc.CallFunc.create(this, this.resetPositionLoopableNode, this._cloudBehind2)
            ))
        );
        this.addChild(this._cloudBehind2, -1);

        // - building
        this._building1 = cc.Sprite.create(res_building);
        this._building1.setAnchorPoint(cc.p(0.0, 1.0));
        this._building1.setPosition(cc.p(0, winSize.height-16));
        this._building1.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                cc.MoveBy.create(0.3, cc.p(-4,0)),
                cc.CallFunc.create(this, this.resetPositionLoopableNode, this._building1)
            ))
        );
        this.addChild(this._building1, -1);

        this._building2 = cc.Sprite.create(res_building);
        this._building2.setAnchorPoint(cc.p(0.0, 1.0));
        this._building2.setPosition(cc.p(winSize.width, winSize.height-16));
        this._building2.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                cc.MoveBy.create(0.3, cc.p(-4,0)),
                cc.CallFunc.create(this, this.resetPositionLoopableNode, this._building2)
            ))
        );
        this.addChild(this._building2, -1);

        // - cloud front
        this._cloudFront1 = cc.Sprite.create(res_cloudFront);
        this._cloudFront1.setAnchorPoint(cc.p(0.0, 1.0));
        this._cloudFront1.setPosition(cc.p(0, winSize.height-20));
        this._cloudFront1.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                cc.MoveBy.create(0.45, cc.p(-5,0)),
                cc.CallFunc.create(this, this.resetPositionLoopableNode, this._cloudFront1)
            ))
        );
        this.addChild(this._cloudFront1, -1);

        this._cloudFront2 = cc.Sprite.create(res_cloudFront);
        this._cloudFront2.setAnchorPoint(cc.p(0.0, 1.0));
        this._cloudFront2.setPosition(cc.p(336, winSize.height-20));
        this._cloudFront2.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                cc.MoveBy.create(0.45, cc.p(-5,0)),
                cc.CallFunc.create(this, this.resetPositionLoopableNode, this._cloudFront2)
            ))
        );
        this.addChild(this._cloudFront2, -1);

        // add character
        global.loadSpriteFrames(res_mainCharacterPlist);
        this._mc = MainCharacter.create();
        this._mc.setPosition(cc.p(winSize.width * 0.8, winSize.height/2 - 32));
        this._mc.addSelfToNode(this);
        global.unloadSpriteFrames(res_mainCharacterPlist);

        global.loadSpriteFrames(res_zombiePlist);
        // add test zombie
        for(var i=0; i<20; i++)
        {
            var zombie = Zombie.create(this._mc.getPosition());
            zombie.setPosition(cc.p(-64, winSize.height - 64 - i*64));
            this.zombies.push(zombie);
            this.addChild(zombie);
        }
        global.unloadSpriteFrames(res_zombiePlist);

        this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);

        this.scheduleUpdate();
        return true;
    },
    resetPositionLoopableNode:function (node) {
        if(node.getPositionX() + 512 < 0)
            node.setPositionX(512);
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
        // update the rotation of weapon
        if(touches)
            this._mc.updateWeaponRotationFrom(touches[0].getLocation());

        if(this.isMouseDown)
        {
            // shoot
            this._mc.shoot(this);
        }
    },
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
    },
    onTouchesCancelled:function (touch, event) {
    },

    onKeyUp:function(e) {

    },
    onKeyDown:function(e) {
        // cycle through the available weapons
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
    },
    update:function(dt) {
        var height = cc.Director.getInstance().getWinSize().height;

        for(var i=0; i<this.zombies.length; i++)
        {
            var z = this.zombies[i];

            this.reorderChild(z, height - z.getPositionY());
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

