var MainCharacterStates = {
	// states
	WALK_STATE: 1,
	BEINGHIT_STATE: 2,
	DIE_STATE: 3,
}

var MainCharacterWeapon = {
	MINIGUN: 0,
	SHOTGUN: 1
}

var WeaponCoolDownTime = {
	MINIGUN: 0.0, // no cool down time
	SHOTGUN: 1.0
}

var MainCharacter = cc.Sprite.extend({
	// animations + actions
	_walkAnimAction:null,
	_beingHitAnimAction:null,
	_dieAnimAction:null,

	// internal
	_weapon:null,
	_aimVec:null,
	_isWeaponFirstShotOut: false,
	_countingWeaponShotCoolDownTime:0,

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

		this._aimVec = cc.p(-1.0, 0.0);	// default of the weapon sprite
		this._bulletSpawnPoint = cc.p(-1.0, -1.0); // dummy

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
		this._weapon = cc.Sprite.create(res_weapons, cc.rect(0, 0, 32, 32));
		this._weapon.setAnchorPoint(cc.p(1.0, 0.5));

		// run default animation
		this.playWalkAnimation();
		// schedule update
		this.schedule(this.countTime, 1.0);

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
			this.currentWeapon = MainCharacterWeapon.MINIGUN;
			this._weapon.setTextureRect(cc.rect(0, 0, 32, 32));
		}
		else if(no == MainCharacterWeapon.SHOTGUN)
		{
			this.currentWeapon = MainCharacterWeapon.SHOTGUN;
			this._weapon.setTextureRect(cc.rect(0, 32, 32, 32));
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

        // update aiming vector
        this._aimVec = vec;
	},
	shoot:function(parent) {
		if(this.currentWeapon == MainCharacterWeapon.MINIGUN)
		{
			// calculate a spawn pos
			var spawnPos = cc.p(this._weapon.getPositionX() + this._aimVec.x*20, this._weapon.getPositionY() + this._aimVec.y*5);
			var destPos = cc.p(spawnPos.x + this._aimVec.x*512, spawnPos.y + this._aimVec.y*448);

			// spawn a bullet
			var bullet = cc.Sprite.create(res_minigunBullet);
			bullet.setPosition(spawnPos);
			// move the bullet in the direction of the aimming vec
			var moveTo = cc.MoveTo.create(1.0, destPos);
			var action = cc.Sequence.create(
				moveTo,
				cc.CallFunc.create(bullet, bullet.removeFromParentAndCleanup, true));
			bullet.runAction(action);
			parent.addChild(bullet);
		}
		else if(this.currentWeapon == MainCharacterWeapon.SHOTGUN)
		{
			if(this._countingWeaponShotCoolDownTime == 0) // only check for 0 is enough
			{
				this._isWeaponFirstShotOut = true;
				// manually called countTime() first time
				this.countTime(0.0000000000000001);

				for(var i=1; i<=5; i++)
				{
					// calculate a spawn pos
					var bullRandomSpawnDir = 1.0;
					if(Math.random() > 0.5)
						bullRandomSpawnDir = -1.0;

					var spawnPos;
					var destPos;

					var absAimVec = cc.p(Math.abs(this._aimVec.x), Math.abs(this._aimVec.y));

					if(absAimVec.x > 0.6)
					{
						spawnPos = cc.p(this._weapon.getPositionX() + this._aimVec.x*21, this._weapon.getPositionY() + this._aimVec.y*5 + Math.random()*bullRandomSpawnDir*2);
						destPos = cc.p(spawnPos.x + this._aimVec.x*512, spawnPos.y + this._aimVec.y*448 + Math.random()*bullRandomSpawnDir*20);
					}
					else if(absAimVec.y > 0.6)
					{
						spawnPos = cc.p(this._weapon.getPositionX() + this._aimVec.x*21 + Math.random()*bullRandomSpawnDir*2, this._weapon.getPositionY() + this._aimVec.y*5);
						destPos = cc.p(spawnPos.x + this._aimVec.x*512 + Math.random()*bullRandomSpawnDir*20, spawnPos.y + this._aimVec.y*448);
					}

					// spawn a bullet
					var bullet = cc.Sprite.create(res_shotgunBullet);
					bullet.setPosition(spawnPos);
					// move the bullet in the direction of the aimming vec
					var moveTo = cc.MoveTo.create(1.0, destPos);
					var action = cc.Sequence.create(
						moveTo,
						cc.CallFunc.create(bullet, bullet.removeFromParentAndCleanup, true));
					bullet.runAction(action);
					parent.addChild(bullet);
				}
			}
		}
	},
	countTime:function(dt) {
		if(this._isWeaponFirstShotOut)
		{
			this._countingWeaponShotCoolDownTime += dt;
			global.log(this._countingWeaponShotCoolDownTime);

			// according to the weapon currently selected
			/*if(this.currentWeapon == MainCharacterWeapon.MINIGUN)
			{
				if(this._countingWeaponShotCoolDownTime > WeaponCoolDownTime.MINIGUN)
				{
					this._countingWeaponShotCoolDownTime = 0;
					this._isWeaponFirstShotOut = false;
				}
			}*/
			if(this.currentWeapon == MainCharacterWeapon.SHOTGUN)
			{
				if(this._countingWeaponShotCoolDownTime > WeaponCoolDownTime.SHOTGUN)
				{
					this._countingWeaponShotCoolDownTime = 0;
					this._isWeaponFirstShotOut = false;
				}
			}
		}
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