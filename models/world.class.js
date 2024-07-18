class World {
    ctx;
    drawId;
    drawing = false;
    keyboard;
    character = new Character();
    level = level1;
    throwableObjects = [];
    camera_x = 0;
    splashes = [];
    globalAlpha = 1;
    alphaDecrease = 0.01;
    fadingAlpha = 1;
    characterBars = [
        new StatusBarHealth(10),
        new StatusBarBottle(),
        new StatusBarCoins()
    ];
    bossBar = new BossHealth(2800);
    endBoss = new Endboss();
    coin_sound = new Audio("assets/audio/collect_coin.mp3");
    bottle_sound = new Audio("assets/audio/bottle_put.mp3");
    bossHit_sound = new Audio("assets/audio/bossHit.mp3");
    hit_sound = new Audio("assets/audio/scream.mp3");

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.offsetX = this.canvas.getBoundingClientRect().x;
        this.offsetY = this.canvas.getBoundingClientRect().y;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.checkCollisions();

    };


    setWorld() {
        this.character.world = this;
        this.character.healthBar = this.characterBars[0];
        this.endBoss.world = this;
        this.endBoss.healthBar = this.bossBar;
    };


    draw() {
        this.resetSurvingEnemies();
        this.prepareCanvas();
        this.addBackgroundsAndCollectables();
        this.addBarsToCanvas();
        this.characterFadeOut();
        this.drawEnemies();
        this.drawSplashes();
        this.drawRotatingBottle();
        this.ctx.translate(-this.camera_x, 0);
        this.drawId = requestAnimationFrame(() => {
            this.draw();
        });

    };


    /**
     * Prepares the canvas for drawing by clearing it, translating the camera,
     * and setting the global alpha.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    prepareCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);//verschiebt die kamera
        this.ctx.globalAlpha = this.globalAlpha;
    };


    /**
     * Adds backgrounds and collectables to the map array.
     *
     * This function takes the background objects, clouds, coins, and bottles
     * from the level object and adds them to the map array.
     *
     * @param {type} level - The level object containing the background objects,
     *                       clouds, coins, and bottles.
     */
    addBackgroundsAndCollectables() {
        this.addToMapArr(this.level.backgroundObjects);
        this.addToMapArr(this.level.clouds);
        if (this.level.coins.length > 0) {
            this.addToMapArr(this.level.coins);
        };
        this.addToMapArr(this.level.bottles);
    };


    /**
     * Adds bars to the canvas.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    addBarsToCanvas() {
        this.addToMapArr(this.characterBars);
        this.addToMap(this.bossBar);
    };


    /**
     * Fades out the character on the canvas.
     *
     * @return {undefined} This function does not return a value.
     */
    characterFadeOut() {
        if (this.character.isFadingOut) {
            this.ctx.globalAlpha = this.fadingAlpha - this.alphaDecrease;
            this.fadingAlpha -= this.alphaDecrease;
            this.addToMap(this.character);
        } else {
            this.addToMap(this.character);
        };
        this.ctx.globalAlpha = 1;
    };


    /**
     * Draws the enemies on the map.
     *
     * @param {type} - No parameters.
     * @return {type} - No return value.
     */
    drawEnemies() {
        this.addToMapArr(this.level.enemies);
        this.addToMap(this.endBoss);
    };


    /**
     * Draws the splashes on the canvas.
     *
     * @return {void} This function does not return a value.
     */
    drawSplashes() {
        if (this.splashes.length > 0) {
            this.splashes.forEach((e) => {
                if (e.isFadingOut) {
                    this.ctx.globalAlpha = this.fadingAlpha - this.alphaDecrease;
                    if (this.splashesNearlyGone()) this.removeSplash();
                    else { this.keepFading(e); };
                } else {
                    this.addToMap(e);
                };
            })
        };
    };


    /**
     * Checks if the global alpha value is nearly gone.
     *
     * @return {boolean} True if the global alpha value is less than or equal to 0.02, false otherwise.
     */
    splashesNearlyGone() {
        return (this.ctx.globalAlpha <= 0.02)
    };


    /**
     * Remove the first element from the splashes array, set the global alpha to 1,
     * and set the fading alpha to 1.
     *
     * @return {undefined} This function does not return a value.
     */
    removeSplash() {
        return this.splashes.splice(this.splashes[0], 1),
            this.ctx.globalAlpha = 1, this.fadingAlpha = 1;
    }


    /**
     * Updates the fading alpha value and adds the specified element to the map.
     *
     * @param {Element} element - The element to be added to the map.
     */
    keepFading(element) {
        this.fadingAlpha -= this.alphaDecrease;
        this.addToMap(element);
        this.ctx.globalAlpha = 1;
    };


    /**
     * Draws a rotating bottle on the canvas.
     *
     * @return {void} This function does not return a value.
     */
    drawRotatingBottle() {
        this.ctx.save();
        if (this.throwableObjects[0]) {
            if (!this.throwableObjects[0].broken) {
                this.addToMap(this.throwableObjects[0]);
            }
        };
        this.ctx.restore();
    };


    /**
     * Add multiple objects to the map array.
     *
     * @param {Array} objs - An array of objects to be added to the map array.
     */
    addToMapArr(objs) {
        objs.forEach((obj) => {
            this.addToMap(obj);
        });
    };


    /**
     * A function that adds a MovableObject to the map.
     *
     * @param {MovableObject} MovableObject - The MovableObject to be added to the map.
     */
    addToMap(MovableObject) {
        try {
            if (MovableObject instanceof ThrowableObject) { this.rotateImage(MovableObject) }
            if (MovableObject.otherDirection) this.flipImage(MovableObject);
            MovableObject.draw(this.ctx)
            if (MovableObject.otherDirection) this.flipImageBack(MovableObject);
        } catch (err) {
            console.log(err, MovableObject)
        };
    };


    /**
     * Flips the image horizontally.
     *
     * @param {MovableObject} MovableObject - The object to be flipped.
     */
    flipImage(MovableObject) {
        this.ctx.save();
        this.ctx.translate(MovableObject.width, 0);
        this.ctx.scale(-1, 1);
        MovableObject.x = MovableObject.x * -1;
        MovableObject.offset.x = 60 + MovableObject.offset.x * -1;
    };


    /**
     * Flips the image back to its original position.
     *
     * @param {MovableObject} MovableObject - The movable object to be flipped.
     * @return {undefined} This function does not return a value.
     */
    flipImageBack(MovableObject) {
        MovableObject.x = MovableObject.x * -1;
        MovableObject.offset.x = 60 + MovableObject.offset.x * -1;
        this.ctx.restore();
    };


    /**
     * Rotates an image around a movable object.
     *
     * @param {MovableObject} MovableObject - The movable object around which the image will be rotated.
     */
    rotateImage(MovableObject) {
        this.ctx.save();
        this.ctx.translate(
            MovableObject.width / 2 + MovableObject.x,
            MovableObject.height / 2 + MovableObject.y
        );
        this.ctx.rotate(MovableObject.rotation);
        this.ctx.translate(
            -MovableObject.width / 2 - MovableObject.x,
            -MovableObject.height / 2 - MovableObject.y
        );
    };


    /**
     * Checks for collisions between different game objects.
     */
    checkCollisions() {
        this.coinCollision();
        this.bottleCollection();
        this.bottleEnemyCollision();
        this.enemyCollision();
        this.endBossCollision();
    };


    /**
     * Handles the collision between the player and coins.
     * Calls the 'takeCoins' function every 10 milliseconds.
     *
     * @param {type} this - the context of the function
     * @return {type} undefined
     */
    coinCollision() {
        interval.call(this, this.takeCoins, 10)
    };


    /**
     * Takes the coins collected by the character.
     * If the character collides with a coin, it plays a coin sound,
     * clears the coin from the canvas, and updates the character's
     * health bar percentage.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    takeCoins() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                if (sound == true) this.coin_sound.play();
                this.handleCoinCollection(coin);
            }
        })
    };


    /**
     * Removes a coin element from the canvas and updates the character's coin collection.
     *
     * @param {Object} element - The coin element to be handled.
     */
    handleCoinCollection(element) {
        this.ctx.clearRect(element.x, element.y, element.width, element.height);
        this.level.coins.splice(this.level.coins.indexOf(element), 1);
        this.characterBars[2].percentage -= 10;
        this.characterBars[2].setPercentage(this.characterBars[2].percentage)
    };


    /**
     * Checks bottle-collection at regular intervals.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    bottleCollection() {
        interval.call(this, this.collectBottles, 10)
    };


    /**
     * Collects bottles based on collision detection with the character and the number of throwable objects available.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    collectBottles() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle) && this.throwableObjects.length < 5) {
                this.ctx.clearRect(bottle.x, bottle.y, bottle.width, bottle.height);
                if (sound == true) this.bottle_sound.play();
                this.level.bottles.splice(this.level.bottles.indexOf(bottle), 1);
                this.throwableObjects.push(new ThrowableObject());
                this.characterBars[1].percentage -= 20;
                this.characterBars[1].setPercentage(this.characterBars[1].percentage)
            }
        })
    };


    /**
     * Sets the interval for bottle-enemy collision.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    bottleEnemyCollision() {
        interval.call(this, this.bottleCollides, 10)
    };


    /**
     * Checks if the bottle collides with specific objects in the level.
     * If a collision occurs, it performs specific actions based on the collided object.
     */
    bottleCollides() {
        if (this.throwableObjects.length > 0) {
            let bottle = this.throwableObjects[0];
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && enemy instanceof Chicken) this.handleChickenHit(bottle, enemy);
            })
            if (bottle.isColliding(this.endBoss) && !this.endBoss.invincible) this.handleBossHit(bottle);
        }
    };


    /**
     * Handles the event when the chicken is hit by a bottle.
     *
     * @param {object} bottle - The bottle object that hit the chicken.
     * @param {object} enemy - The enemy object that represents the chicken.
     */
    handleChickenHit(bottle, enemy) {
        this.bottleBreak(bottle);
        this.chickenDies(enemy);
    }


    /**
     * Handles the boss hit by breaking the bottle,
     * updating the boss hit status, and playing a sound.
     *
     * @param {type} bottle - the bottle that was used to hit the boss
     * @return {type} - the result of the boss hit
     */
    handleBossHit(bottle) {
        this.bottleBreak(bottle);
        this.endBoss.isHit();
        if (sound == true) this.bossHit_sound.play();
    }


    /**
     * The inteval for checking the collision between the character and the boss.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    endBossCollision() {
        interval.call(this, this.characterBossInteraction, 10)
    };


    /**
     * Executes the interaction between the character and the boss.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    characterBossInteraction() {
        if (this.bossBehindCharacter()) {
            this.character.energie = 0;
            this.character.healthBar.setPercentage(0);
        }
        if (this.character.isColliding(this.endBoss)) {
            this.character.isHit();
            if (sound) this.hit_sound.play();
        };
    };


    /**
     * Checks if the boss went past the character.
     *
     * @return {boolean} Whether there is a boss behind the character or not.
     */
    bossBehindCharacter() {
        return (this.endBoss.offset.x + this.endBoss.offset.width < this.character.x);
    };


    /**
     * Handles collision between the character and enemy objects.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    enemyCollision() {
        interval.call(this, this.characterEnemyInteraction, 10)
    };


    /**
     * Performs interactions between the character and enemies.
     * This function checks if the character is jumping and if it is jumping upon an enemy.
     * If the enemy is a chicken, it checks if it is a chick or not.
     * If it is a chick, it calls the 'littleChickDies' function.
     * If it is not a chick, it calls the 'chickenDies' function and updates some character properties.
     * If the character is not jumping but is colliding with an enemy, it calls the 'isHit' function.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    characterEnemyInteraction() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isJumping) {
                if (this.character.isJumpingUpon(enemy) && enemy instanceof Chicken) this.differChickenSize(enemy);
            } else if (this.character.isColliding(enemy)) {
                this.character.isHit();
                if (sound) this.hit_sound.play();
            };
        })
    };


    /**
     * Differ the size of the chicken based on the enemy type.
     *
     * @param {object} enemy - The enemy object to compare with.
     * @return {void} The function does not return any value.
     */
    differChickenSize(enemy) {
        if (enemy instanceof Chick) {
            this.chickDies(enemy)
        } else {
            this.chickenDies(enemy);
            this.character.speedY = 5;
            this.hitChicken = true;
            this.character.monitorJumpEnd();
        };
    }


    /**
     * Performs a specified action when an enemy chicken dies.
     *
     * @param {Object} enemy - The enemy chicken that dies.
     * @return {number} - The index of the enemy chicken that gets plucked.
     */
    chickenDies(enemy) {
        return (enemy.getsPlucked(this.level.enemies.indexOf(enemy)),
            setTimeout(() => {
                enemies.splice(this.level.enemies.indexOf(enemy), 1);
            }, 1000));
    };


    /**
     * A function that causes the chick to die.
     *
     * @param {object} enemy - The enemy that caused the little chick to die.
     * @return {undefined} - This function does not return a value.
     */
    chickDies(enemy) {
        return (enemy.getsStompedOn(this.level.enemies.indexOf(enemy)),
            setTimeout(() => {
                enemies.splice(this.level.enemies.indexOf(enemy), 1);
            }, 1000));
    };


    /**
     * Resets the position of any surviving enemies that have moved off the screen.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    resetSurvingEnemies() {
        this.level.enemies.forEach((e) => {
            if (e.x + e.width < 0) { e.x = 2800 }
        })
        this.level.clouds.forEach((e) => {
            if (e.x + e.width < 0) { e.x = 2800 }
        })
    };


    /**
     * Adds a new splash to the splashes array, breaks the given bottle, removes it from the throwableObjects array, and adds a new throwable object to the throwableObjects array.
     *
     * @param {Bottle} bottle - The bottle object to break.
     * @return {void} This function does not return anything.
     */
    bottleBreak(bottle) {
        this.splashes.push(new Splash(bottle.x + 10, bottle.y + 30));
        bottle.break();
        this.throwableObjects.splice(this.throwableObjects.indexOf(bottle), 1);
        this.throwableObjects.push(new ThrowableObject());
    };
}