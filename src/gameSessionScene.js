var GameSessionLayer = cc.Layer.extend({

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

        this.setTouchEnabled(true);
        return true;
    },

    onTouchBegan:function (touches, event) {
    },
    onTouchMoved:function (touch, event) {
    },
    onTouchesEnded:function (touch, event) {
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

