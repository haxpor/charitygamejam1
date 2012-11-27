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

var WeaponBulletVec = {
	MINIGUN_X: -16,
	MINIGUN_Y: -7,
	SHOTGUN_X: -12,
	SHOTGUN_Y: 1
}

var MainCharacter = cc.Sprite.extend({
	// animations + actions
	_walkAnimAction:null,
	_beingHitAnimAction:null,
	_dieAnimAction:null,

	// internal
	_weapon:null,
	_aimVec:null,
	_bulletVec:null,
	_isWeaponFirstShotOut: false,
	_countingWeaponShotCoolDownTime:0,
	_bullets:null,

	// attributes
	hp:100,
	currentState: -1,
	currentWeapon: -1,

	initWithSpriteFrame:function(frame) {
		// call super's init() function first
		if(!this._super(frame))
		{
			return false;
		}

		// init basic attributes
		this.hp = 100;
		this.currentState = MainCharacterStates.WALK_STATE;
		this.currentWeapon = MainCharacterWeapon.MINIGUN;

		this._aimVec = cc.p(-1.0, 0.0);	// default of the weapon sprite
		this._bulletVec = cc.p(WeaponBulletVec.MINIGUN_X, WeaponBulletVec.MINIGUN_Y);
		this._bulletSpawnPoint = cc.p(-1.0, -1.0); // dummy
		this._bullets = [];

		// ## ANIMATION ##
		// walk
		var frames = new Array();

		for(var i=0; i<4; i++)
		{
			frames.push(global.getSpriteFrame("main_char_walk" + (i+1) + ".png"));
		}
		var animate = cc.Animate.create(cc.Animation.create(frames, 1/7.0));
		this._walkAnimAction = cc.RepeatForever.create(animate);

		// being hit
		frames.length = 0;
		for(var i=0; i<4; i++)
		{
			frames.push(global.getSpriteFrame("main_char_underattack" + (i+1) + ".png"));
		}
		animate = cc.Animate.create(cc.Animation.create(frames, 1/7.0));
		this._beingHitAnimAction = cc.Sequence.create(
			cc.CallFunc.create(this, this._stopWalkAnimation),
			cc.Repeat.create(animate, 1),
			cc.CallFunc.create(this, this.playWalkAnimation));

		// die
		frames.length = 0;
		for(var i=0; i<4; i++)
		{
			frames.push(global.getSpriteFrame("main_char_die" + (i+1) + ".png"));
		}

		animate = cc.Animate.create(cc.Animation.create(frames, 1/8.0));
		this._dieAnimAction = cc.Repeat.create(animate, 1);

		// ## WEAPON ##
		this._weapon = cc.Sprite.create(res_weapons, cc.rect(0, 0, 32, 32));
		//this._weapon.setAnchorPoint(cc.p(1.0, 0.5));

		// run default animation
		this.playWalkAnimation();
		// schedule update
		this.schedule(this.countTime, 1.0);
		this.scheduleUpdate();

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
		this._weapon.setPosition(pos);
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
		var acosVal = Math.acos(dot);
		var angle = acosVal * 180 / Math.PI;
		if(vec.y < 0.0)
            angle *= -1.0;
        if(vec.y > 0.0)
        	acosVal *= -1.0;

        // update rotation to weapon
        this._weapon.setRotation(angle);
        // update the bullet vector from angle
        if(this.currentWeapon == MainCharacterWeapon.MINIGUN)
        {
        	this._bulletVec.x = (WeaponBulletVec.MINIGUN_X * Math.cos(acosVal)) - (WeaponBulletVec.MINIGUN_Y * Math.sin(acosVal));
        	this._bulletVec.y = (WeaponBulletVec.MINIGUN_Y * Math.cos(acosVal)) + (WeaponBulletVec.MINIGUN_X * Math.sin(acosVal));
        }
        else if(this.currentWeapon == MainCharacterWeapon.SHOTGUN)
        {
        	this._bulletVec.x = (WeaponBulletVec.SHOTGUN_X * Math.cos(acosVal)) - (WeaponBulletVec.SHOTGUN_Y * Math.sin(acosVal));
        	this._bulletVec.y = (WeaponBulletVec.SHOTGUN_Y * Math.cos(acosVal)) + (WeaponBulletVec.SHOTGUN_X * Math.sin(acosVal));
        }

        // update aiming vector
        this._aimVec = vec;
	},
	shoot:function(parent) {
		if(this.currentWeapon == MainCharacterWeapon.MINIGUN)
		{
			// calculate a spawn pos
			var spawnPos = cc.p(this._weapon.getPositionX() + this._bulletVec.x, this._weapon.getPositionY() + this._bulletVec.y);
			var destPos = cc.p(spawnPos.x + this._aimVec.x*512, spawnPos.y + this._aimVec.y*448);

			// spawn a bullet
			var bullet = cc.Sprite.create(res_minigunBullet);
			bullet.setPosition(spawnPos);
			// move the bullet in the direction of the aimming vec
			var moveTo = cc.MoveTo.create(1.0, destPos);
			var action = cc.Sequence.create(
				moveTo,
				cc.CallFunc.create(this, this.removeBullet, bullet));
			bullet.runAction(action);
			this._bullets.push(bullet);
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
						spawnPos = cc.p(this._weapon.getPositionX() + this._bulletVec.x, this._weapon.getPositionY() + this._bulletVec.y + Math.random()*bullRandomSpawnDir*2);
						destPos = cc.p(spawnPos.x + this._aimVec.x*512, spawnPos.y + this._aimVec.y*448 + Math.random()*bullRandomSpawnDir*20);
					}
					else if(absAimVec.y > 0.6)
					{
						spawnPos = cc.p(this._weapon.getPositionX() + this._bulletVec.x + Math.random()*bullRandomSpawnDir*2, this._weapon.getPositionY() + this._bulletVec.y);
						destPos = cc.p(spawnPos.x + this._aimVec.x*512 + Math.random()*bullRandomSpawnDir*20, spawnPos.y + this._aimVec.y*448);
					}

					// spawn a bullet
					var bullet = cc.Sprite.create(res_shotgunBullet);
					bullet.setPosition(spawnPos);
					// move the bullet in the direction of the aimming vec
					var moveTo = cc.MoveTo.create(1.0, destPos);
					var action = cc.Sequence.create(
						moveTo,
						cc.CallFunc.create(this, this.removeBullet, bullet));
					bullet.runAction(action);
					this._bullets.push(bullet);
					parent.addChild(bullet);
				}
			}
		}
	},
	removeBullet:function (bullet) {
		// remove from internal manage list
		cc.ArrayRemoveObject(this._bullets, bullet);
		// clear all actions of bullet itself
		bullet.removeFromParentAndCleanup(true);
	},
	countTime:function(dt) {
		if(this._isWeaponFirstShotOut)
		{
			this._countingWeaponShotCoolDownTime += dt;

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
	},
	update:function(dt) {
		// checking collision of bullets against the zombie
		for(var i=0; i<this._bullets.length; i++)
		{
			var b = this._bullets[i];

			for(var j=0; j<this.getParent().zombies.length; j++)
			{
				var z = this.getParent().zombies[j];

				// hit once by the same bullet
				if(z.currentState == ZombieStates.BEINGHIT_STATE)
					continue;

				if(cc.Rect.CCRectIntersectsRect(
					cc.rect(z.getPositionX(), z.getPositionY(), 32, 32),
					cc.rect(b.getPositionX(), b.getPositionY(), b.getContentSize().width, b.getContentSize().height))
					)
				{
					z.hitByBullet(this.currentWeapon, this._aimVec);

					break;
				}
			}
		}
	}
});

MainCharacter.create = function () {
	var character = new MainCharacter();
	if(character && character.initWithSpriteFrame(global.getSpriteFrame("main_char_walk1.png")))
	{
		return character;
	}
	else
	{
		character = null;
		return null;
	}
}