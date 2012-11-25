var MainCharacterStates = {
	// states
	FREEZE_STATE: 0,	// or idle
	WALK_STATE: 1,
	BEINGHIT_STATE: 2,
	DIE_STATE: 3,
}

var MainCharacterWeapon = {
	MINIGUN: 0,
	SHOTGUN: 1
}

var MainCharacter = cc.Sprite.extend({
	// animations + actions
	_walkAnimAction:null,
	_beingHitAnimAction:null,
	_dieAnimAction:null,

	// weapon
	_weapon:null,

	// attributes
	hp:100,
	currentState: -1,
	currentWeapon: -1,

	initWithFile:function(filename, rect) {
		// call super's init() function first
		if(!this._super(filename, rect))
		{
			return false;
		}

		// init basic attributes
		this.hp = 100;
		this.currentState = MainCharacterStates.WALK_STATE;
		this.currentWeapon = MainCharacterWeapon.MINIGUN;

		// ## ANIMATION ##
		// walk
		var frames = new Array();

		for(var i=0; i<3; i++)
		{
			frames.push(cc.SpriteFrame.create(res_mainCharacter, cc.rect(i*32,0, 32, 32)));
		}
		var animate = cc.Animate.create(cc.Animation.create(frames, 1/7.0));
		this._walkAnimAction = cc.RepeatForever.create(animate);

		// being hit
		frames.length = 0;
		for(var i=0; i<3; i++)
		{
			frames.push(cc.SpriteFrame.create(res_mainCharacter, cc.rect(i*32, 32, 32, 32)));
		}
		animate = cc.Animate.create(cc.Animation.create(frames, 1/7.0));
		this._beingHitAnimAction = cc.Sequence.create(
			cc.CallFunc.create(this, this._stopWalkAnimation),
			cc.Repeat.create(animate, 1),
			cc.CallFunc.create(this, this.playWalkAnimation));

		// die
		frames.length = 0;
		for(var i=0; i<3; i++)
			frames.push(cc.SpriteFrame.create(res_mainCharacter, cc.rect(i*32, 32*2, 32, 32)));
		for(var i=0; i<3; i++)
			frames.push(cc.SpriteFrame.create(res_mainCharacter, cc.rect(i*32, 32*3, 32, 32)));
		animate = cc.Animate.create(cc.Animation.create(frames, 1/8.0));
		this._dieAnimAction = cc.Repeat.create(animate, 1);

		// ## WEAPON ##
		this._weapon = cc.Sprite.create(res_minigun);
		this._weapon.setAnchorPoint(cc.p(1.0, 0.5));

		// run default animation
		this.playWalkAnimation();

		return true;
	},

	// walk animation
	playWalkAnimation:function() {
		// set the state
		this.currentState = MainCharacterStates.WALK_STATE;
		// run action
		this.runAction(this._walkAnimAction);
	},
	_stopWalkAnimation:function() {
		// stop the action
		this.stopAction(this._walkAnimAction);
	},

	// being hit animation
	playBeingHitAnimation:function() {
		this.currentState = MainCharacterStates.BEINGHIT_STATE;
		this.runAction(this._beingHitAnimAction);
	},
	//_stopBeingHitAnimation:function() {
	//	this.stopAction(this._beingHitAnimAction);
	//}

	// die animation
	playDieAnimation:function() {
		this.currentState = MainCharacterStates.DIE_STATE;
		this.stopAllActions();
		this.runAction(this._dieAnimAction);
	},

	// override: also set the position of weapon
	setPosition:function(pos) {
		this._super(pos);
		this._weapon.setPosition(cc.p(pos.x+16,pos.y+16));
	},

	addSelfToNode:function(node) {
		node.addChild(this);
		node.addChild(this._weapon);
	},
	changeWeaponTo:function(no) {
		if(no == MainCharacterWeapon.MINIGUN)
		{

		}
		else if(no == MainCharacterWeapon.SHOTGUN)
		{

		}
	},
	updateWeaponRotationFrom:function(aimPos) {
		var vec = cc.p(aimPos.x - this._weapon.getPositionX(), aimPos.y - this._weapon.getPositionY());

		// normalize
		var l = 1.0 / Math.sqrt(vec.x * vec.x + vec.y * vec.y);
		vec.x = vec.x * l;
		vec.y = vec.y * l;

		// dot
		// dot between unit-up vector, and vec
		var dot = vec.x * -1.0 + vec.y * 0.0;

		// calculate rotation angle
		var angle = Math.acos(dot) * 180 / Math.PI;
		if(vec.y < 0.0)
            angle *= -1.0;

        // update rotation to weapon
        this._weapon.setRotation(angle);
	}
});

MainCharacter.create = function () {
	var character = new MainCharacter();
	if(character && character.initWithFile(res_mainCharacter, cc.rect(0,0,32,32)))
	{
		return character;
	}
	else
	{
		character = null;
		return null;
	}
}