var SpawnRule = {
	ZOMBIE_AMOUNT_INCREASE_PER_WAVE: 3,
	PERCENT_DELTA_TIME_DECREASE_PER_WAVE: 0.05,

	BASE_ZOMBIE_AMOUNT: 5,
	BASE_DELTA_TIME: 30.0,	// in seconds

	LIMIT_ZOMBIE_AMOUNT: 200
}

function ZombieSpawner () {
	this._parent = null;	// gameSessionLayer object
	this._countingTime = SpawnRule.BASE_DELTA_TIME;	// to make it immediately spawns at the first time

	this._currentZombieAmount = SpawnRule.BASE_ZOMBIE_AMOUNT;
	this._currentDeltaTime = SpawnRule.BASE_DELTA_TIME;
	
	this.initWithParent = function(parent) {
		this._parent = parent;

		return true;
	};
	this.update = function(dt) {
		this._countingTime += dt;

		if(this._countingTime > this._currentDeltaTime)
		{
			// spawn
			this._spawnPattern1();	// only one pattern so far

			// calculate new active rules
			this._currentZombieAmount += SpawnRule.ZOMBIE_AMOUNT_INCREASE_PER_WAVE;
			this._currentDeltaTime *= (1.0 - SpawnRule.PERCENT_DELTA_TIME_DECREASE_PER_WAVE);

			// reset time
			this._countingTime = 0;
		}
	};
	
	// spawn patterns
	this._spawnPattern1 = function () {
		global.log("spawns pattern 1");

		var winSize = cc.Director.getInstance().getWinSize();

		for(var i=0; i<this._currentZombieAmount; i++)
        {
            var zombie = Zombie.create(this._parent.getMainCharacter().getPosition());
            zombie.setPosition(cc.p(-64, winSize.height - 64 - i*64));
            this._parent.zombies.push(zombie);
            this._parent.addChild(zombie);
        }
	};
}

ZombieSpawner.create = function(parent) {
	var zs = new ZombieSpawner();
	if(zs && zs.initWithParent(parent))
	{
		return zs;
	}
	else
	{
		zs = null;
		return null;
	}
}