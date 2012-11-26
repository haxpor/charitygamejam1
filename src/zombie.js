var ZombieStates = {
	WALK_STATE: 1,
	ATTACK_STATE: 2,
	BEINGHIT_STATE: 3,
	DIE_STATE: 4
}

var Zombie = cc.Sprite.extend({
	// animations + actions
	_walkAnimAction:null,
	_attackAnimAction:null,
	_beingHitAnimAction:null,
	_dieAnimAction:null,

	// attributes
	hp:100,
	currentState: -1,

	initWithFile:function(filename, rect) {
		if(!this._super(filename, rect))
		{
			return false;
		}

		// init basic attributes
		this.hp = 100;
		this.currentState = ZombieStates.WALK_STATE;

		// ## ANIMATION ##
		var frames = new Array();

		// walk
		for(var i=0; i<4; i++)
		{
			frames.push(cc.SpriteFrame.create(res_zombie, cc.rect(i*32,0,32,32)));
		}
		var animate = cc.Animate.create(cc.Animation.create(frames, 1/6.0));
		this._walkAnimAction = cc.RepeatForever.create(animate);

		// attack
		frames.length = 0;
		for(var i=0; i<4; i++)
		{
			frames.push(cc.SpriteFrame.create(res_zombie, cc.rect(i*32,32,32,32)));
		}
		animate = cc.Animate.create(cc.Animation.create(frames, 1/7.0));
		this._attackAnimAction = cc.Sequence.create(
			cc.Repeat.create(animate, 1),
			cc.CallFunc.create(this, this.anim_checkToGoBackToPreviousAIState));

		// being hit
		frames.length = 0;
		for(var i=0; i<4; i++)
		{
			frames.push(cc.SpriteFrame.create(res_zombie, cc.rect(i*32,64,32,32)));
		}
		animate = cc.Animate.create(cc.Animation.create(frames, 1/7.0));
		this._beingHitAnimAction = cc.Sequence.create(
			cc.Repeat.create(animate, 1),
			cc.CallFunc.create(this, this.anim_checkToGoBackToPreviousAIState));

		// die
		frames.length = 0;
		for(var i=0; i<4; i++)
		{
			frames.push(cc.SpriteFrame.create(res_zombie, cc.rect(i*32,96,32,32)));
		}
		animate = cc.Animate.create(cc.Animation.create(frames, 1/7.0));
		this._dieAnimAction = cc.Sequence.create(
			cc.Repeat.create(animate, 1),
			cc.CallFunc.create(this, this.anim_blinkAndDisappear));

		// run default animation
		this.playWalkAnimation();

		return true;
	},

	// walk animation
	playWalkAnimation:function() {
		this.stopAllActions();

		this.currentState = ZombieStates.WALK_STATE;
		this.runAction(this._walkAnimAction);
	},

	// attack animation
	playAttackAnimation:function() {
		this.stopAllActions();

		this.currentState = ZombieStates.ATTACK_STATE;
		this.runAction(this._attackAnimAction);
	},

	// being hit animation
	playBeingHitAnimation:function () {
		this.stopAllActions();

		this.currentState = ZombieStates.BEINGHIT_STATE;
		this.runAction(this._beingHitAnimAction);
	},

	// die animation
	playDieAnimation:function () {
		this.stopAllActions();

		this.currentState = ZombieStates.DIE_STATE;
		this.runAction(this._dieAnimAction);
	},

	// check the current state whether it needs to go back to the previuos state or not, or just continue
	// doing the action it's currently doing.
	anim_checkToGoBackToPreviousAIState:function () {
		
	},
	anim_blinkAndDisappear:function () {

	}
});

Zombie.create = function() {
	var zombie = new Zombie();
	if(zombie && zombie.initWithFile(res_zombie, cc.rect(0,0,32,32)))
	{
		return zombie;
	}
	else
	{
		zombie = null;
		return zombie;
	}
}