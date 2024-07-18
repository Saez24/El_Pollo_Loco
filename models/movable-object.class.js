class MovableObject extends DrawableObject {
    otherDirection = false;
    accelearion = 1;
    energy = 100;
    gotHurt = false;
    speedY = 0;
    gravityId;
    lastHit;

    /**
     * Initializes a new instance of the constructor.
     *
     * @param {type} x - the x value
     * @param {type} y - the y value
     * @param {type} speed - the speed value
     * @return {type} - description of return value
     */
    constructor(x, y, speed) {
        super();
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.default_positionY = this.y;
    };

    /**
     * Animate the element.
     *
     * @return {undefined} No return value.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    };

    /**
     * Plays an animation using the provided image array.
     *
     * @param {Array} image - The array of images for the animation.
     */
    playAnimation(image) {
        let i = this.currentImage % image.length;
        let path = image[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    };

    /**
     * Moves the object to the right.
     *
     * @param {type} paramName - N/A
     * @return {type} N/A
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
        this.world.keyboard.KEY_LEFT = false;
    };

    /**
     * Moves the object to the left by decreasing its x-coordinate by the current speed.
     *
     * @param {undefined} 
     * @return {undefined} 
     */
    moveLeft() {
        this.x -= this.speed;
    };

    /**
     * Apply gravity to the object.
     *
     * This function applies a gravitational force to the object to simulate its
     * movement in a downward direction. It starts an interval that calls the
     * "this.gravityInterval" function every 1/60th of a second.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    applyGravity() {
        this.gravityId = setInterval(() => {
            this.gravityInterval();
        }, 1000 / 60);
    };

    /**
     * Updates the position of the object based on gravity.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */

    gravityInterval() {
        if (this.isAboveGround(this.default_positionY) || this.speedY > 0) this.keepFalling();
        if (!this.isAboveGround(this.default_positionY)) {
            this.y = this.default_positionY;
            if (this instanceof ThrowableObject) {
                clearInterval(intervalIds.splice(intervalIds.indexOf(this.gravityId), 1))
            } else {
                this.stopFalling();
                if (this instanceof Character) {
                    this.isJumping = false;
                    this.hitChicken = false;
                }
            }
        }
    };

    /**
     * Decreases the y-coordinate of the object based on its speed and acceleration.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    keepFalling() {
        this.y -= this.speedY;
        this.speedY -= this.accelearion;
    };

    /**
     * Stops the falling motion of the object.
     *
     * @param {none} 
     * @return {none} 
     */
    stopFalling() {
        this.speedY = 0;
    };

    /**
     * Check if the object is above the ground.
     *
     * @param {number} default_positionY - The default position Y.
     * @return {boolean} True if the object is above the ground, false otherwise.
     */
    isAboveGround(default_positionY) {
        return this.y <= default_positionY;
    };

    /**
     * Checks if this object is colliding with another object.
     *
     * @param {Object} obj - The object to check collision with.
     * @return {boolean} Returns true if there is a collision, false otherwise.
     */
    isColliding(obj) {
        return (
            this.offset.x + this.offset.width > obj.offset.x
            && this.offset.x <= obj.offset.x + obj.offset.width
            && this.offset.y + this.offset.height > obj.offset.y
            && this.offset.y <= obj.offset.y + obj.offset.height
        );
    };

    /**
     * Checks if the object is being jumped upon.
     *
     * @param {Object} obj - The object to check against.
     * @return {boolean} Returns true if the object is being jumped upon, false otherwise.
     */
    jumpingUpon(obj) {
        return (
            this.speedY <= 0
            && this.offset.y + this.offset.height > obj.offset.y
            && this.offset.x + this.offset.width > obj.offset.x
            && this.offset.x < obj.offset.x + obj.offset.width
        )
    };

    /**
     * Checks if the entity is hit.
     *
     * @return {undefined} No return value.
     */
    isHit() {
        if (this.gotHurt) {
            return;
        } else if (!this.gotHurt) {
            this.health_percentage = this.energy -= 20;
            this.gotHurt = true;
            this.triggerDamageResponse();
            if (this instanceof Character) {
                this.refreshIdleTimer();
            }
            if (this.energy <= 0) {
                this.healthBar.setPercentage(0);
            }
        }
    };

    /**
     * Stops the specified music.
     *
     * @param {type} music - The music to stop.
     * @return {type} None.
     */
    stopMusic(music) {
        music.pause();
        music.currentTime = 0;
        music.loop = false;
    };

    /**
     * Determines if the object is dead.
     *
     * @return {boolean} Returns true if the object's energy is less than or equal to 0, false otherwise.
     */
    isDead() {
        return this.energy <= 0;
    };


    /**
     * Triggers the damage response animation if the object is not dead.
     *
     * @return {void}
     */
    triggerDamageResponse() {
        if (!this.isDead()) {
            this.lastHit = new Date().getTime();
            this.initiateDamageAnimation();
        }
    };

    /**
     * Initiates the damage response animation.
     *
     * @return {void} There is no return value.
     */
    initiateDamageAnimation() {
        this.hurt_interval = setInterval(() => {
            this.refreshHealthbar();
            if (this.passedTime(this.lastHit)) {
                this.resetHurtState();
                if (this instanceof Endboss) {
                    if (this.energy == 160) this.attack();
                    else if (this.energy == 99) this.attack();
                    else if (this.energy == 38) this.attack();
                    else { this.monitorAngryCharacter() };
                }
            }
        }, 1000 / 25);
    };

    /**
     * Refreshes the healthbar.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    refreshHealthbar() {
        this.playAnimation(this.IMAGES_HURT);
        this.healthBar.setPercentage(this.health_percentage);
    };

    /**
     * Stops the object from taking damage and resets the hurt state.
     *
     * @return {void} 
     */
    resetHurtState() {
        clearInterval(this.hurt_interval);
        this.gotHurt = false;
    }


    /**
     * Executes attack
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    attack() {
        this.energy -= 1;
        this.clearAllIntervals();
        this.jump();

    };

    /**
     * Calculates the time passed since the given time in milliseconds.
     *
     * @param {number} time - The starting time in milliseconds.
     * @return {boolean} True if the time passed is greater than 1.5 seconds, false otherwise.
     */
    passedTime(time) {
        let passedTime = new Date().getTime() - time;
        passedTime = passedTime / 1000;
        return (passedTime > 1.5)
    };
};