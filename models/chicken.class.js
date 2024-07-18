class Chicken extends MovableObject {
    animation_interval;
    offsetY;
    chicken_hit = new Audio("assets/audio/chicken_hit.mp3");
    IMAGES_WALKING = [
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];

    IMAGES_DEAD = [
        "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
        "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
    ];

    constructor(i) {
        super();
        this.loadImage("assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png");
        this.height = 50;
        this.width = 50;
        this.y = 395;
        this.offsetY = this.y;
        this.x = (Math.random() * 700 + 300) * i + 300;
        this.speed = 0.5 + Math.random() * 1.5;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    };

    /**
     * Animates the object by continuously moving it to the left, playing a walking animation,
     * and adjusting the offset if the object is a Chick.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    animate() {
        this.animation_interval = setInterval(() => {
            this.moveLeft();
            this.playAnimation(this.IMAGES_WALKING);
            if (this instanceof Chick) {
                this.chickOffset();
            } else {
                this.chickenOffset()
            }
        }, 1000 / 15);
    };

    /**
     * Generates the function comment for the given function body.
     *
     * @return {void} The function does not return a value.
     */
    chickenOffset() {
        this.offset = {
            width: 50,
            height: 50,
            x: this.x,
            y: this.offsetY
        };
    };

    /**
     * Generates the function comment for the given function body.
     *
     * @param {} - no parameters
     * @return {} - no return value
     */
    chickOffset() {
        this.offset = {
            width: 25,
            height: 50,
            x: this.x,
            y: this.offsetY
        };
    };

    /**
     * Clears the animation interval, resets the offset values, plays a sound if enabled, and loads a new image.
     */
    chickenDead() {
        clearInterval(this.animation_interval);
        this.animation_interval = null;
        this.offset.width = 0;
        this.offset.height = 0;
        this.offset.y = 500;
        if (sound == true) this.chicken_hit.play();
        this.loadImage("assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
    };
};
