class Character extends MovableObject {
    world;
    x = 50;
    y = 200;
    healthBar;
    health_percentage;
    canThrow = true;
    isJumping = false;
    isTrowing = false;
    isSleeping = false;
    default_positionY = 200;
    idleTimeout;
    hitChicken = false;
    sleepTimeout = 4000;
    jumpImage = 0;
    deadId;
    walking_sound = new Audio("assets/audio/walk.mp3");
    jumping_sound = new Audio("assets/audio/jump.mp3");
    throwing_sound = new Audio("assets/audio/bottle_trow.mp3");
    sleeping_sound = new Audio("assets/audio/sleeping.mp3");
    game_over = new Audio("assets/audio/gameOver.mp3");

    IMAGES_WALKING = [
        "assets/img/2_character_pepe/2_walk/W-21.png",
        "assets/img/2_character_pepe/2_walk/W-22.png",
        "assets/img/2_character_pepe/2_walk/W-23.png",
        "assets/img/2_character_pepe/2_walk/W-24.png",
        "assets/img/2_character_pepe/2_walk/W-25.png",
        "assets/img/2_character_pepe/2_walk/W-26.png"
    ];

    IMAGES_SLEEPING = [
        "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-20.png"
    ];

    IMAGES_JUMPING = [
        "assets/img/2_character_pepe/3_jump/J-32.png",
        "assets/img/2_character_pepe/3_jump/J-32.png",
        "assets/img/2_character_pepe/3_jump/J-34.png",
        "assets/img/2_character_pepe/3_jump/J-34.png",
        "assets/img/2_character_pepe/3_jump/J-35.png",
        "assets/img/2_character_pepe/3_jump/J-36.png",
        "assets/img/2_character_pepe/3_jump/J-37.png",
        "assets/img/2_character_pepe/3_jump/J-38.png",
        "assets/img/2_character_pepe/3_jump/J-39.png"
    ];

    IMAGES_DEAD = [
        "assets/img/2_character_pepe/5_dead/D-51.png",
        "assets/img/2_character_pepe/5_dead/D-52.png",
        "assets/img/2_character_pepe/5_dead/D-53.png",
        "assets/img/2_character_pepe/5_dead/D-54.png",
        "assets/img/2_character_pepe/5_dead/D-55.png",
        "assets/img/2_character_pepe/5_dead/D-56.png",
        "assets/img/2_character_pepe/5_dead/D-57.png"
    ];

    IMAGES_HURT = [
        "assets/img/2_character_pepe/4_hurt/H-41.png",
        "assets/img/2_character_pepe/4_hurt/H-42.png",
        "assets/img/2_character_pepe/4_hurt/H-43.png"
    ];

    /**
     * Initializes the object by loading images, animating, applying gravity, and setting the speed.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    constructor() {
        super();
        this.loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_SLEEPING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.applyGravity();
        this.refreshIdleTimer();
        this.speed = 5;
    };

    /**
    * Executes a series of key bindings for the current interval.
    *
    * @return {void} This function does not return any value.
    */
    processKeyBindings() {
        this.handleKeyRight();
        this.handleKeyLeft();
        this.handleKeyUp();
        this.handleKeyThrow();
        this.updateCamera();
    };

    /**
     * Animates the elements of the page.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    animate() {
        setInterval(() => {
            this.sleeping();
        }, 1000 / 3);
        setInterval(() => {
            this.processKeyBindings();
        }, 1000 / 60);
        setInterval(() => {
            this.updateMovement();
        }, 80);
        this.checkCharacterHealth();
    };

    /**
    * Monitors the character's health.
    * If the energy drops below or equal to 10, it prepares for death and handles related actions.
    *
    * @return {undefined} There is no return value.
    */
    checkCharacterHealth() {
        const scanDeath = setInterval(() => this.checkHealth(scanDeath), 60);
    };

    /**
     * Checks the character's health.
     * If the energy is low, it triggers the death handling process.
     *
     * @param {number} scanDeath - The interval ID to clear when needed.
     * @return {undefined} There is no return value.
     */
    checkHealth(scanDeath) {
        if (this.energy <= 10) {
            this.handleDeath(scanDeath);
        }
    };

    /**
     * Makes the character sleep.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    sleeping() {
        if (this.isSleeping) {
            if (!this.gotHurt) {
                this.playAnimation(this.IMAGES_SLEEPING);
                if (sound == true) this.sleeping_sound.play();
            }
        }
    };

    /**
     * Marks the character as sleeping.
     *
     * This function sets the `isSleeping` flag to true.
     *
     * @return {void} This function does not return a value.
     */
    markAsSleeping() {
        this.isSleeping = true;
    };

    /**
     * A function to handle the key right event.
     *
     * @return {undefined} This function does not return a value.
     */
    handleKeyRight() {
        if (this.world.keyboard.KEY_RIGHT && this.x + this.width / 2 < this.world.level.level_limit) {
            this.walkingRight();
            if (this.y == this.default_positionY) {
                if (sound == true) this.walking_sound.play();
            }
        }
    };

    /**
     * Checks if the left arrow key is pressed and the object's x position is within bounds,
     * then triggers the walking left animation and plays a walking sound if the object is on the default Y position.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    handleKeyLeft() {
        if (this.world.keyboard.KEY_LEFT && this.x > 0 + this.width / 2) {
            this.walkingLeft();
            if (this.y == this.default_positionY) {
                if (sound == true) this.walking_sound.play()
            };
        }
    };

    /**
     * Triggered when the up arrow key is pressed.
     *
     * @param {void} No parameters.
     * @return {void} No return value.
     */
    handleKeyUp() {
        if (this.world.keyboard.KEY_UP && this.y == this.default_positionY) {
            this.performJump();
            this.refreshIdleTimer();
        }
    };

    /**
     * Throws a key if the throw key is pressed and the player has bottles and is looking forward.
     *
     * @return {undefined} This function does not return a value.
     */
    handleKeyThrow() {
        if (this.world.keyboard.KEY_THROW) {
            this.refreshIdleTimer();
            if (this.throwBottlesWhileLookingForward()) {
                this.throw();
                if (sound == true) this.throwing_sound.play()
            }
        }
    };

    /**
    * Check if the entity can throw bottles and is looking forward.
    *
    * @return {boolean} True if the entity can throw bottles and is looking forward, false otherwise.
    */
    throwBottlesWhileLookingForward() {
        const hasBottles = this.world.throwableObjects.length > 0;
        const isLookingForward = !this.otherDirection;
        const canThrowBottles = this.canThrow && !this.isTrowing;

        return hasBottles && isLookingForward && canThrowBottles;
    };

    /**
    * Checks if the character is walking to the left.
    *
    * @return {boolean} - Returns true if the character is walking to the left.
    */
    walkingLeft() {
        this.refreshIdleTimer();
        this.moveLeft();
        this.takeStatuscharacterBars(-40);
        this.otherDirection = true;
        return true; // Assuming the function should return true
    };

    /**
     * Checks if the character is walking to the right.
     *
     * @return {boolean} - Returns true if the character is walking to the right.
     */
    walkingRight() {
        this.refreshIdleTimer();
        this.moveRight();
        this.takeStatuscharacterBars(-40);
        this.isSleeping = false;
        return true; // Assuming the function should return true
    };

    /**
     * Sets the camera position and offset based on the current object position.
     *
     * @return {Object} An object containing the camera position and offset.
     */
    updateCamera() {
        return (
            this.world.camera_x = -this.x + this.width / 2,
            this.offset = {
                width: 40,
                height: 130,
                x: this.x + 30,
                y: this.y + 100
            }
        );
    };

    /**
     * Handles the death process for the character.
     * Prepares for death, stops music, plays game over sound, and starts dying animation.
     *
     * @param {number} scanDeath - The interval ID to clear.
     * @return {undefined} There is no return value.
     */
    handleDeath(scanDeath) {
        this.prepareForDeath();
        clearInterval(scanDeath);

        if (music) {
            this.stopMusic(backgroundMusic);
            this.stopMusic(intro_music);
        }

        if (sound) {
            this.game_over.play();
        }

        this.startDyingAnimation();
    };

    /**
     * Prepares the character for death.
     * Sets the fading out flag and marks the character as no longer alive.
     *
     * @return {undefined} There is no return value.
     */
    prepareForDeath() {
        this.isFadingOut = true;
        characterAlive = false;
        this.stopMusic(chicken_walk);
    };

    /**
    * Starts the dying animation for the character.
    * Sets up an interval that repeatedly executes the dying animation until the last frame is reached.
    *
    * @return {undefined} There is no return value.
    */
    startDyingAnimation() {
        this.dyingInterval = setInterval(this.handleDyingAnimation.bind(this), 1000 / 30);
    };

    /**
     * Handles the execution of the dying animation.
     * Plays the death animation and clears the interval when the last frame is reached.
     * Calls the game overlay function.
     *
     * @return {undefined} There is no return value.
     */
    handleDyingAnimation() {
        this.playAnimation(this.IMAGES_DEAD);

        if (this.img.src.endsWith("57.png")) {
            clearInterval(this.dyingInterval);
            gameOverlay();
        }
    };

    /**
    * Controls the character's movement and actions based on its state.
    *
    * @return {undefined} This function does not return a value.
    */
    updateMovement() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.isJumping) {
            this.handleJumpingAnimation();
        } else {
            this.handleWalkingAnimation();
        }
    };

    /**
     * Handles the jumping animation based on the character's state.
     *
     * @return {undefined} This function does not return a value.
     */
    handleJumpingAnimation() {
        if (!this.gotHurt && !this.hitChicken) {
            this.playJumpAnimation(this.IMAGES_JUMPING);
        }
    };

    /**
     * Handles the walking animation based on keyboard input.
     *
     * @return {undefined} This function does not return a value.
     */
    handleWalkingAnimation() {
        if (this.world.keyboard.KEY_RIGHT || this.world.keyboard.KEY_LEFT) {
            if (!this.gotHurt) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }
    };

    /**
     * Initiates a jump action for the character.
     *
     * @return {undefined} This function does not return a value.
     */
    performJump() {
        if (this.isGrounded()) {
            this.initiateJump();
            this.monitorJumpEnd();
        }
    };

    /**
    * Determines if the character is on the ground.
    *
    * @return {boolean} Returns true if the character is grounded, false otherwise.
    */
    isGrounded() {
        return !this.isJumping && this.y === this.default_positionY;
    };

    /**
     * Initiates the jump action for the character, setting the jump state and speed.
     * Plays the jumping sound if sound effects are enabled.
     *
     * @return {undefined} This function does not return a value.
     */
    initiateJump() {
        this.isJumping = true;
        this.speedY = 20;
        if (sound) this.jumping_sound.play();
    };

    /**
     * Monitors the character's position to end the jump once it returns to the ground.
     *
     * @return {undefined} This function does not return a value.
     */
    monitorJumpEnd() {
        const checkGroundInterval = setInterval(() => {
            if (this.y === this.default_positionY) {
                clearInterval(checkGroundInterval);
                this.finalizeJump();
            }
        }, 10);
    };

    /**
     * Resets the jump-related properties when the character lands.
     *
     * @return {undefined} This function does not return a value.
     */
    finalizeJump() {
        this.jumpImage = 0;
        this.img = this.imageCache[this.IMAGES_JUMPING[0]];
    };

    /**
     * Resets the jump-related properties when the character is back on the ground.
     *
     * @return {undefined} This function does not return a value.
     */
    resetJump() {
        this.jumpImage = 0;
        this.img = this.imageCache[this.IMAGES_JUMPING[0]];
    };

    /**
     * Plays the jump animation using the provided images.
     *
     * @param {Array} images - An array of images to be used in the animation.
     * @return {undefined} This function does not return a value.
     */
    playJumpAnimation(images) {
        if (this.isAboveGround) {
            if (this.hitChicken) {
                return this.img === this.imageCache[this.IMAGES_JUMPING[0]];
            }
            const i = this.jumpImage % images.length;
            this.img = this.imageCache[images[i]];
            this.jumpImage++;
        }
    };

    /**
     * Update the position of the status character bars.
     *
     * @param {number} x - The offset for the character bars.
     */
    takeStatuscharacterBars(x) {
        this.world.bossHealthBar.x = this.x + 440
        this.world.characterBars.forEach(element => {
            element.x = this.x + x
        });
    };

    /**
     * Throws an object and updates the character bars.
     *
     * @return {undefined} This function does not have a return value.
     */
    throw() {
        this.world.throwableObjects[0].throwBottle(this.x + 30, this.y + 100)
        this.world.characterBars[1].percentage += 20
        this.world.characterBars[1].setPercentage(this.world.characterBars[1].percentage)
        this.isTrowing = true;
        setTimeout(() => {
            this.world.throwableObjects.pop();
            this.isTrowing = false;
        }, 1000);
    };

    /**
    * Initiates the idle timer.
    *
    * This function sets a timer using `setTimeout` to trigger the `isSleeping` flag
    * after a specified duration.
    *
    * @param {number} sleepDuration - The duration in milliseconds after which the `isSleeping` flag
    * will be set to `true`.
    * @return {void} This function does not return any value.
    */
    beginIdleTimer() {
        this.idleTimeout = setTimeout(() => {
            this.markAsSleeping();
        }, this.sleepTimeout);
    };

    /**
     * Resets the idle timer and prepares the system for user interaction.
     *
     * This function clears the idle timeout, sets the `isSleeping` flag to false, pauses the sleeping sound,
     * resets its current time to 0, and restarts the idle timer to monitor user activity.
     *
     * @return {void} This function does not return a value.
     */
    refreshIdleTimer() {
        clearTimeout(this.idleTimeout);
        this.isSleeping = false;
        this.sleeping_sound.pause();
        this.sleeping_sound.currentTime = 0;
        this.beginIdleTimer();
    };
};
