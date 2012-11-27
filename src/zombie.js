var ZombieStates = {
	WALK_WANDER_STATE: 1,
	WALK_APPROACH_STATE: 2,
	ATTACK_STATE: 3,
	BEINGHIT_STATE: 4,
	BEINGHIT_WAITING_STATE: 5,
	DIE_STATE: 6,
	DIE_WAITING_STATE: 7,
}

var ZombieSettings = {
	APPROACH_LENGTH: 50,	// length before zombie approaches to attack a target directly
	MAX_WANDER_X: 10,
	MAX_WANDER_Y: 10,
	//MAX_DELAY_EACH_WANDER_POS: 0.7, 
	//MIN_DELAY_EACH_WANDER_POS: 0.1,
	MAX_DURATION_MOVETO_WANDER: 0.6,
	MIN_DURATION_MOVETO_WANDER: 0.34,
	MAX_DURATION_MOVETO_APPRAOCH: 0.35,
	MIX_DURATION_MOVETO_WANDER: 0.15
}

var ZombieActionTag = {
	ANIMATION: 1,
	MOVE: 2,
	HIT_SEQUENCE: 3
}

var Zombie = cc.Sprite.extend({
	// animations + actions
	_walkAnimAction:null,
	_attackAnimAction:null,
	_beingHitAnimAction:null,
	_dieAnimAction:null,

	_targetPos:null,
	_isReachedNextWanderPos:true,

	// attributes
	hp:100,
	previousState: -1,
	currentState: -1,
	nextState: -1,

	initWithFileAndTargetPos:function(filename, rect, pos) {
		if(!this.initWithFile(filename, rect))
		{
			return false;
		}

		// init basic attributes
		this.hp = 100;
		this.currentState = ZombieStates.WALK_WANDER_STATE;
		this._targetPos = pos;

		// ## ANIMATION ##
		var frames = new Array();

		// walk
		for(var i=0; i<4; i++)
		{
			frames.push(cc.SpriteFrame.create(res_zombie, cc.rect(i*32,0,32,32)));
		}
		var animate = cc.Animate.create(cc.Animation.create(frames, 1/6.0));
		this._walkAnimAction = cc.RepeatForever.create(animate);
		this._walkAnimAction.setTag(1);

		// attack
		frames.length = 0;
		for(var i=0; i<4; i++)
		{
			frames.push(cc.SpriteFrame.create(res_zombie, cc.rect(i*32,32,32,32)));
		}
		animate = cc.Animate.create(cc.Animation.create(frames, 1/7.0));
		this._attackAnimAction = cc.Repeat.create(animate, 1);
		this._attackAnimAction.setTag(ZombieActionTag.ANIMATION);

		// being hit
		frames.length = 0;
		for(var i=0; i<4; i++)
		{
			frames.push(cc.SpriteFrame.create(res_zombie, cc.rect(i*32,64,32,32)));
		}
		var beingHitAnim = cc.Animation.create(frames, 1/7.0);
		beingHitAnim.setRestoreOriginalFrame(false);
		animate = cc.Animate.create(beingHitAnim);
		this._beingHitAnimAction = cc.Repeat.create(animate, 1);
		this._beingHitAnimAction.setTag(ZombieActionTag.ANIMATION);

		// die
		frames.length = 0;
		for(var i=0; i<4; i++)
		{
			frames.push(cc.SpriteFrame.create(res_zombie, cc.rect(i*32,96,32,32)));
		}
		animate = cc.Animate.create(cc.Animation.create(frames, 1/7.0));
		this._dieAnimAction = cc.Sequence.create(
			cc.Repeat.create(animate, 1),
			cc.Blink.create(1.0, 5),
			cc.CallFunc.create(this, this.removeFromParentAndCleanup, true));
		this._dieAnimAction.setTag(ZombieActionTag.ANIMATION);

		// run default animation
		this.playWalkWanderAnimation();
		this.schedule(this.updateAI, 1/60.0);

		return true;
	},

	// walk wander animation
	playWalkWanderAnimation:function() {
		this.stopActionByTag(ZombieActionTag.ANIMATION);
		this.runAction(this._walkAnimAction);
	},

	// walk approach animation
	playWalkApproachAnimation:function() {
		this.playWalkWanderAnimation();
	},

	// attack animation
	playAttackAnimation:function() {
		this.stopActionByTag(ZombieActionTag.ANIMATION);
		this.runAction(this._attackAnimAction);
	},

	// being hit animation
	playBeingHitAnimation:function (nextState) {
		this.stopActionByTag(ZombieActionTag.HIT_SEQUENCE);

		if(nextState == ZombieStates.DIE_STATE)
		{
			var sequence = cc.Sequence.create(
				cc.CallFunc.create(this, this._changeToState, ZombieStates.DIE_STATE),
				this._beingHitAnimAction,
				this._dieAnimAction
			);
			sequence.setTag(ZombieActionTag.HIT_SEQUENCE);
			this.runAction(sequence);
		}
		else if(nextState == ZombieStates.WALK_APPROACH_STATE)
		{
			var sequence = cc.Sequence.create(
				this._beingHitAnimAction,
				cc.CallFunc.create(this, this._changeToWalkApproachState),
				cc.CallFunc.create(this, this.playWalkWanderAnimation)
			);
			sequence.setTag(ZombieActionTag.HIT_SEQUENCE);
			this.runAction(sequence);
		}
		else if(nextState == ZombieStates.WALK_WANDER_STATE)
		{
			var sequence = cc.Sequence.create(
				this._beingHitAnimAction,
				cc.CallFunc.create(this, this._changeToWalkWanderState),
				cc.CallFunc.create(this, this.playWalkApproachAnimation)
			);
			sequence.setTag(ZombieActionTag.HIT_SEQUENCE);
			this.runAction(sequence);
		}

		global.log("play being hit animation [" + this.numberOfRunningActions() + "]");
	},

	// die animation
	playDieAnimation:function () {
		this.stopAllActions();

		// also move the dead body to the left
		var moveLeft = cc.MoveTo.create(2.0, cc.p(-64, this.getPositionY()));
		this.runAction(moveLeft);

		this.runAction(this._dieAnimAction);
	},
	updateAI:function (dt) {
		if(this.currentState == ZombieStates.WALK_WANDER_STATE)
		{
			if(this._isReachedNextWanderPos)
			{
				// a new wander point
				this._isReachedNextWanderPos = false;

				// random a next wander position
				var nextWanderPos = cc.p(
					this.getPositionX() + Math.random() * ZombieSettings.MAX_WANDER_X,
					this.getPositionY() + Math.random() * ZombieSettings.MAX_WANDER_Y * gmath.randomDirectionValue());
				// bound
				var winSize = cc.Director.getInstance().getWinSize();
				if(nextWanderPos.y < 32)
				{
					nextWanderPos.y = 32;
				}
				else if(nextWanderPos.y > winSize.height-64-32)
				{
					nextWanderPos.y = winSize.height - 64 - 32;
				}

				// set course for nextWanderPos
				var moveTo = cc.MoveTo.create(
					gmath.randomBetween(ZombieSettings.MIN_DURATION_MOVETO_WANDER, ZombieSettings.MAX_DURATION_MOVETO_WANDER),
					nextWanderPos);
				var sequence = cc.Sequence.create(
					moveTo,
					cc.CallFunc.create(this, this.movedToNextWanderPos)
				);
				sequence.setTag(ZombieActionTag.MOVE);
				this.runAction(sequence);
				global.log("it's in WALK WANDER [" + this.numberOfRunningActions() + "]");
			}
		}
		else if(this.currentState == ZombieSettings.WALK_APPROACH_STATE)
		{
			// set course directly to a target
			var nextPos = cc.p(
				this._targetPos.x - Math.random() * 5 - 4,
				this._targetPos.y - Math.random() * 20 * gmath.randomDirectionValue()
				);

			var moveTo = cc.MoveTo.create(
				gmath.randomBetween(ZombieSettings.MIN_DURATION_MOVETO_APPRAOCH, ZombieSettings.MAX_DURATION_MOVETO_APPRAOCH));
			var sequence = cc.Sequence.create(
				moveTo,
				cc.CallFunc.create(this, this._changeToAttackState)
				);
			this.runAction(sequence);
		}
		else if(this.currentState == ZombieStates.BEINGHIT_STATE)
		{
			//var val = gmath.getLengthFrom(this._targetPos, this.getPosition());
			//global.log("val = " + val);

			var nextStateFeed = -1;

			// check to change state
			if(this.hp <= 0)
			{
				this.nextState = ZombieStates.BEINGHIT_WAITING_STATE;
				nextStateFeed = ZombieStates.DIE_STATE;
			}
			else if(gmath.getLengthFrom(this._targetPos, this.getPosition()) < ZombieSettings.APPROACH_LENGTH)
			{
				this._isReachedNextWanderPos = true;
				this.nextState = ZombieStates.BEINGHIT_WAITING_STATE;
				nextStateFeed = ZombieStates.WALK_APPROACH_STATE;
				global.log("entered approach state");
			}
			else
			{
				this._isReachedNextWanderPos = true;
				this.nextState = ZombieStates.BEINGHIT_WAITING_STATE;
				nextStateFeed = ZombieStates.WALK_WANDER_STATE;
			}

			// play animation
			this.playBeingHitAnimation(nextStateFeed);

			global.log("it's in BEINGHIT STATE [" + this.numberOfRunningActions() + "]");
		}
		else if(this.currentState == ZombieStates.BEINGHIT_WAITING_STATE)
		{
			// just consume, yum yum !
		}
		else if(this.currentState == ZombieStates.ATTACK_STATE)
		{
			global.log("Changed to ATTACK STATE");
			// add later ...
		}
		else if(this.currentState == ZombieStates.DIE_STATE)
		{
			// remove zombie from parent node (no longer effect in checking bullet collision)
			cc.ArrayRemoveObject(this.getParent().zombies, this);
			// play animation
			this.playDieAnimation();

			this.nextState = ZombieStates.DIE_WAITING_STATE;
		}
		else if(this.currentState == ZombieStates.DIE_WAITING_STATE)
		{
			// just consume here, yum yum !
		}
		else
		{
			global.log("something bad going on for Zombie's updating state.");
		}

		// update the previous state
		this.previousState = this.currentState;
		// update next state
		if(this.nextState != -1)
		{
			this.currentState = this.nextState;
			this.nextState = -1;
		}
	},
	movedToNextWanderPos:function() {
		this._isReachedNextWanderPos = true;
	},
	hitByBullet:function(typeOfBullet, hitUnitVec) {
		// reduce hp
		if(typeOfBullet == MainCharacterWeapon.MINIGUN)
		{
			this.hp--;

			// knock-back by the bullet
			var moveBy = cc.MoveBy.create(0.032, cc.p(3*hitUnitVec.x, 3*hitUnitVec.y));
			this.stopActionByTag(ZombieActionTag.MOVE);
			this._isReachedNextWanderPos = false;	// prevent from flickering animation
			this.runAction(moveBy);
		}
		else if(typeOfBullet == MainCharacterWeapon.SHOTGUN)
		{
			this.hp -= 5;

			// knock-back by the bullet
			var moveBy = cc.MoveBy.create(0.032, cc.p(10*hitUnitVec.x, 10*hitUnitVec.y));
			this.stopActionByTag(ZombieActionTag.MOVE);
			this._isReachedNextWanderPos = false;	// prevent from flickering animation
			this.runAction(moveBy);
		}

		this.nextState = ZombieStates.BEINGHIT_STATE;

		global.log("it's in hitByBullet [" + this.numberOfRunningActions() + "]");
	},
	_changeToWalkWanderState:function () {
		this.nextState = ZombieStates.WALK_WANDER_STATE;
	},
	_changeToWalkApproachState:function () {
		this.nextState = ZombieStates.WALK_APPROACH_STATE;
	},
	_changeToAttackState:function () {
		this.nextState = ZombieStates.ATTACK_STATE;
	}
});

Zombie.create = function(targetPos) {
	var zombie = new Zombie();
	if(zombie && zombie.initWithFileAndTargetPos(res_zombie, cc.rect(0,0,32,32), targetPos))
	{
		return zombie;
	}
	else
	{
		zombie = null;
		return zombie;
	}
}