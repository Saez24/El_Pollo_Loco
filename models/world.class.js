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
    bossHealthBar = new BossHealth(2800);
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
        this.endBoss.healthBar = this.bossHealthBar;
    };

    draw() {
        this.resetSurvivingEntities();
        this.initializeCanvas();
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
    initializeCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.ctx.globalAlpha = this.globalAlpha;
    };

    /**
     * Adds backgrounds and collectables to the map array.
     *
     * This function takes the background objects, clouds, coins, and bottles
     * from the level object and adds them to the map array.
     *
     * @return {void}
     */
    addBackgroundsAndCollectables() {
        const { backgroundObjects, clouds, coins, bottles } = this.level;
        this.addToMapArray(backgroundObjects);
        this.addToMapArray(clouds);
        this.addToMapArray(coins);
        this.addToMapArray(bottles);
    };

    /**
     * Adds bars to the canvas.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    addBarsToCanvas() {
        this.addToMapArray(this.characterBars);
        this.addToMap(this.bossHealthBar);
    };

    /**
     * Fades out the character on the canvas.
     */
    characterFadeOut() {
        if (this.character.isFadingOut) {
            this.ctx.globalAlpha -= this.alphaDecrease;
            this.addToMap(this.character);
        } else {
            this.addToMap(this.character);
        }

        this.ctx.globalAlpha = 1;
    };

    /**
     * Draws the enemies on the map.
     *
     * @param {type} - No parameters.
     * @return {type} - No return value.
     */
    drawEnemies() {
        this.addToMapArray(this.level.enemies);
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
    };

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
    addToMapArray(objs) {
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
     * @param {MovableObject} movableObject - The movable object around which the image will be rotated.
     */
    rotateImage(movableObject) {
        const { ctx } = this;
        const { x, y, width, height, rotation } = movableObject;

        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate(rotation);
        ctx.translate(-(x + width / 2), -(y + height / 2));
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
        setInterval(() => {
            this.takeCoins();
        }, 10);
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
     * Handles the collection of a coin element.
     *
     * @param {Object} element - The coin element to be handled.
     */
    handleCoinCollection(element) {
        this.ctx.clearRect(element.x, element.y, element.width, element.height);
        this.level.coins = this.level.coins.filter(coin => coin !== element);
        this.updateCharacterCoinBar(-10);
    };

    /**
     * Updates the character's coin bar percentage.
     *
     * @param {number} amount - The amount to adjust the coin bar percentage.
     */
    updateCharacterCoinBar(amount) {
        this.characterBars[2].percentage += amount;
        this.characterBars[2].setPercentage(this.characterBars[2].percentage);
    };

    /**
     * Checks bottle-collection at regular intervals.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    bottleCollection() {
        setInterval(() => {
            this.collectBottles();
        }, 10);
    };

    /**
     * Collects bottles if the character collides with them and there are fewer than 5 throwable objects available.
     */
    collectBottles() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle) && this.throwableObjects.length < 5) {
                this.ctx.clearRect(bottle.x, bottle.y, bottle.width, bottle.height);
                if (sound) this.bottle_sound.play(); // Assuming `sound` is a boolean flag
                this.level.bottles.splice(index, 1);
                this.throwableObjects.push(new ThrowableObject());
                this.characterBars[1].percentage -= 20;
                this.characterBars[1].setPercentage(this.characterBars[1].percentage);
            }
        });
    };

    /**
     * Sets the interval for bottle-enemy collision.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    bottleEnemyCollision() {
        setInterval(() => {
            this.bottleCollides();
        }, 10);
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
    };

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
    };

    /**
     * The inteval for checking the collision between the character and the boss.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    endBossCollision() {
        setInterval(() => {
            this.characterBossInteraction();
        }, 10);
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
     * Handles collision between the character and enemy objects at regular intervals.
     *
     * @return {void}
     */
    enemyCollision() {
        setInterval(() => {
            this.handleCharacterEnemyInteractions();
        }, 10);
    };

    /**
     * Handles interactions between the character and enemies.
     * Checks if the character is jumping on an enemy or colliding with an enemy.
     * If the character is jumping on a chicken, it handles the chicken's response.
     * If the character is colliding with an enemy, it calls the 'isHit' function.
     *
     * @return {void}
     */
    handleCharacterEnemyInteractions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isJumping && this.character.jumpingUpon(enemy) && enemy instanceof Chicken) {
                this.handleChickenInteraction(enemy);
            } else if (this.character.isColliding(enemy)) {
                this.character.isHit();
                if (sound) this.hit_sound.play();
            }
        });
    };

    /**
     * Handles the interaction with a chicken, determining if it's a chick or a regular chicken.
     *
     * @param {object} enemy - The enemy object to interact with.
     * @return {void}
     */
    handleChickenInteraction(enemy) {
        if (enemy instanceof Chick) {
            this.chickDies(enemy);
        } else {
            this.chickenDies(enemy);
            this.character.speedY = 5;
            this.hitChicken = true;
            this.character.monitorJumpEnd();
        }
    };

    /**
     * Performs a specified action when an enemy chicken dies.
     *
     * @param {Object} enemy - The enemy chicken that dies.
     * @return {number} - The index of the enemy chicken that gets plucked.
     */
    chickenDies(enemy) {
        return (enemy.chickenDead(this.level.enemies.indexOf(enemy)),
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
        return (enemy.chickDead(this.level.enemies.indexOf(enemy)),
            setTimeout(() => {
                enemies.splice(this.level.enemies.indexOf(enemy), 1);
            }, 1000));
    };

    /**
     * Resets the position of any surviving enemies and clouds that have moved off the screen.
     *
     * @return {void}
     */
    resetSurvivingEntities() {
        const resetPosition = (entity) => {
            if (entity.x + entity.width < 0) {
                entity.x = 2800;
            }
        };

        [...this.level.enemies, ...this.level.clouds].forEach(resetPosition);
    };

    /**
     * Adds a new splash to the splashes array, breaks the given bottle,
     * removes it from the throwableObjects array, and adds a new throwable object.
     *
     * @param {Bottle} bottle - The bottle object to break.
     * @return {void} This function does not return anything.
     */
    bottleBreak(bottle) {
        const { x, y } = bottle;
        this.splashes.push(new Splash(x + 10, y + 30));
        bottle.break();
        this.throwableObjects = this.throwableObjects.filter(obj => obj !== bottle);
        this.throwableObjects.push(new ThrowableObject());
    };
};