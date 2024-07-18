class Endboss extends MovableObject {
    width = 300;
    height = 360;
    active = false;
    energie = 100;
    healthBar;
    health_percentage;
    invincible = true;
    x = 2600;
    y = 110;
    default_positionY = this.y;
    offset = {
        width: 250,
        height: 200,
        x: this.x + 30,
        y: this.y + 80
    };
    moving_interval = null;
    arrivement_interval = null;
    engage_interval = null;
    attackPreparation_interval = null;
    walking_interval = null;
    jumpX_interval = null;
    dead_interval = null;
    boss_jump = new Audio("assets/audio/bossJump.mp3");

    IMAGES_WALKING = [
        "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G4.png",
    ];

    IMAGES_ALERT = [
        "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G12.png"
    ];

    IMAGES_HURT = [
        "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
        "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
        "assets/img/4_enemie_boss_chicken/4_hurt/G23.png"
    ];

    IMAGES_ATTACK_INITIATION = [
        "assets/img/4_enemie_boss_chicken/3_attack/G13.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G14.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G15.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G16.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G17.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G20.png"

    ];

    IMAGES_DEAD = [
        "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
        "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
        "assets/img/4_enemie_boss_chicken/5_dead/G26.png"
    ];

    IMAGE_ATTACK = [
        "assets/img/4_enemie_boss_chicken/3_attack/G18.png"
    ];

    IMAGES_LANDING = [
        "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G20.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G19.png"
    ];


    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[1]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGE_ATTACK);
        this.loadImages(this.IMAGES_LANDING);
        this.loadImages(this.IMAGES_ATTACK_INITIATION);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.applyGravity();
        this.characterArrives();
        this.speed = 2;
    };


    /**
     * Executes a function when a character arrives.
     *
     * @return {undefined} This function does not return a value.
     */
    characterArrives() {
        this.arrivement_interval = setInterval(() => {
            try {
                if (this.active) return;
                if (this.world.character.x >= 1990) {
                    this.world.character.canThrow = false;
                    this.startIntro();
                };
            } catch (e) {
                console.log(e, this)
            }
        }, 300);
    };


    /**
     * Starts the introduction sequence.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    startIntro() {
        this.changeMusic();
        this.active = true;
        this.healthBarAppears();
        this.intro();
        clearInterval(this.arrivement_interval);
        this.arrivement_interval = null;
    };


    /**
     * Executes the intro animation.
     *
     * @param {} 
     * @return {}
     */
    intro() {
        let i = 0;
        this.engage_interval = setInterval(() => {
            this.playAnimation(this.IMAGES_ALERT);
            i++;
            if (i == 7) this.introEnds();
        }, 500);
    };


    /**
     * Updates the y position of the health bar until it reaches a certain point.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    healthBarAppears() {
        let interval = setInterval(() => {
            if (this.world.bossBar.y <= 20) {
                this.world.bossBar.y += 1
            } else {
                this.world.bossBar.y = 20;
                clearInterval(interval);
                interval = null;
            }
        }, 1000 / 60);
    };


    /**
     * Initializes the `IMAGES_ALERT` variable to `null`, clears the `engage_interval` interval, 
     * sets it to `null`, loads the image "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
     * enables the character to throw, and calls the `jump` function.
     *
     * @param {} - No parameters
     * @return {} - No return value
     */
    introEnds() {
        this.IMAGES_ALERT = null;
        clearInterval(this.engage_interval);
        this.engage_interval = null;
        this.loadImage("assets/img/4_enemie_boss_chicken/2_alert/G12.png");
        this.world.character.canThrow = true;
        this.jump();
    };


    /**
     * Executes the jump action.
     *
     * @return {void} 
     */
    jump() {
        let i = 0;
        this.invincible = true;
        this.attackPreparation_interval = setInterval(() => {
            this.playAnimation(this.IMAGES_ATTACK_INITIATION);
            i++;
            if (this.preJumpAnimationEnds(i)) {
                this.bossAttacks()
            };
        }, 1000 / 8);
    };


    /**
     * Executes the boss attack.
     *
     * @return {undefined} No return value.
     */
    bossAttacks() {
        clearInterval(this.attackPreparation_interval)
        this.attackPreparation_interval = null;
        if (sound == true) this.boss_jump.play()
        this.speedY = 20;
        this.bossTakesOff(this.IMAGE_ATTACK, 1, 60);
    };


    /**
     * Executes the landing animation.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    landingAnimation() {
        let i = 0;
        let landing_interval = setInterval(() => {
            this.playAnimation(this.IMAGES_LANDING);
            i++;
            if (this.reachedLastAnimationImg(i)) this.watchMadAtCharacter(landing_interval)
        }, 1000 / 30)
    };


    /**
     * Watch for a character that is mad.
     *
     * @param {number} interval - The interval to watch for the character.
     */
    watchMadAtCharacter(interval) {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        this.loadImage("assets/img/4_enemie_boss_chicken/2_alert/G12.png");
        this.invincible = false;
        this.moving_interval = setInterval(() => {
            this.moveLeft();
            this.keepOffset();
        }, 1000 / 60)
        this.movingAnimation()
    };


    /**
     * Executes a moving animation for the character.
     *
     * @return {undefined} This function does not return a value.
     */
    movingAnimation() {
        this.walking_interval = setInterval(() => {
            if (this.isDead()) {
                this.bossDies();
            } else if (this.gotHurt) {
                this.clearMovementInterval();
            }
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000 / 8)
    };


    /**
     * Clears the movement intervals.
     *
     * @return {undefined} 
     */
    clearMovementInterval() {
        clearInterval(this.walking_interval);
        clearInterval(this.moving_interval);
        this.walking_interval = null;
        this.moving_interval = null;
    }


    /**
     * Stops the boss's movement and triggers the boss's dying animation.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    bossDies() {
        clearInterval(this.walking_interval);
        clearInterval(this.moving_interval);
        this.walking_interval = null;
        this.moving_interval = null;
        this.speedY = 20;
        this.bossTakesOff(this.IMAGES_DEAD, -1, 40);
    };


    /**
     * Executes the boss taking off animation.
     *
     * @param {Object} animationCache - The cache of animation frames.
     * @param {number} multiplicator - The multiplyer to differ between forwards and backwards movements.
     * @param {number} frames - The number of frames per second for the animation.
     */
    bossTakesOff(animationCache, multiplicator, frames) {
        let i = 0;
        this.jumpX_interval = setInterval(() => {
            this.keepOffset();
            this.x = this.x - 8 * multiplicator;
            this.playAnimation(animationCache);
            if (this.isDead()) {
                i++;
                this.animateDying(i)
            } else if (this.isTouchingGround()) this.jumpEnds();
        }, 1000 / frames);
    };


    /**
     * Stops the jump animation and triggers the landing animation.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    jumpEnds() {
        clearInterval(this.jumpX_interval);
        this.jumpX_interval = null;
        this.landingAnimation()
    };


    /**
     * Animate the dying animation for the given index.
     *
     * @param {number} i - The index of the animation.
     */
    animateDying(i) {
        if (i == this.IMAGES_DEAD.length - 1) {
            clearInterval(this.jumpX_interval);
            this.jumpX_interval = null;
            this.deadBoss()
        }
    };


    /**
     * Executes the dead boss animation.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    deadBoss() {
        this.dead_interval = setInterval(() => {
            this.playAnimation(this.IMAGES_DEAD);
            this.default_positionY = 180;
            if (this.deadBossOnGround()) {
                this.finalAnimation()
            }
        }, 1000 / 30)
    };


    /**
     * Checks if the boss is dead on the ground.
     *
     * @return {boolean} Returns true if the boss is dead on the ground, otherwise false.
     */
    deadBossOnGround() {
        return (this.y == this.default_positionY)
    };


    /**
     * Executes the final animation.
     *
     * @return {void} This function does not return anything.
     */
    finalAnimation() {
        clearInterval(this.dead_interval);
        this.dead_interval = null;
        this.loadImage(this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]);
        this.succsess()
    }


    /**
     * Sets the offset property of the object.
     * The offset is an object that contains the width, height, x, and y values.
     *
     * This function does not take any parameters.
     *
     * @return {void} This function does not return anything.
     */
    keepOffset() {
        this.offset = {
            width: 250,
            height: 200,
            x: this.x + 30,
            y: this.y + 80
        };
    };


    /**
     * Checks if the pre-jump animation has ended.
     *
     * @param {number} i - The index of the image.
     * @return {boolean} Returns true if the pre-jump animation has ended, false otherwise.
     */
    preJumpAnimationEnds(i) {
        return (i == this.IMAGES_ATTACK_INITIATION.length)
    };


    /**
     * Check if the object is touching the ground.
     *
     * @return {boolean} true if the object is touching the ground, false otherwise.
     */
    isTouchingGround() {
        return (this.y == this.default_positionY)
    };


    /**
     * Checks if the given index is the last index of the array IMAGES_LANDING.
     *
     * @param {number} i - The index to be checked.
     * @return {boolean} Returns true if the index is the last index, otherwise returns false.
     */
    reachedLastAnimationImg(i) {
        return (i == this.IMAGES_LANDING.length - 1)
    };


    /**
     * Clears all intervals used in the class.
     * This function clears all intervals used for movement, arrival, engagement,
     * attack preparation, walking, jumping, and death animation. It sets all
     * interval variables to null.
     */
    clearAllIntervals() {
        clearInterval(this.moving_interval);
        this.moving_interval = null;
        clearInterval(this.arrivement_interval);
        this.arrivement_interval = null;
        clearInterval(this.engage_interval);
        this.engage_interval = null;
        clearInterval(this.attackPreparation_interval);
        this.attackPreparation_interval = null;
        clearInterval(this.walking_interval);
        this.walking_interval = null;
        clearInterval(this.jumpX_interval);
        this.jumpX_interval = null;
        clearInterval(this.dead_interval);
        this.dead_interval = null;
    };


    /**
     * Change the current music.
     *
     * @return {undefined} No return value
     */
    changeMusic() {
        this.stopMusic(backgroundMusic)
        this.stopMusic(chicken_walk);
        if (music == true) {
            intro_music.play()
            intro_music.volume = 0.1;
        }
    };


    /**
     * Perform necessary actions when the success condition is met.
     *
     * @return {undefined} This function does not have a return value.
     */
    succsess() {
        bossAlive = false;
        this.stopMusic(intro_music);
        this.stopMusic(chicken_walk);
        if (sound == true) winning_sound.play();
        winning_sound.loop = false;
        gameOverlay();
    };
}

