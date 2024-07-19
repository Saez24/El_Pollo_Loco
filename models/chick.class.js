class Chick extends Chicken {
    offsetY = this.y + 10;
    default_positionY = 415;
    speed = Math.round(Math.random() * 3) + 1;
    speedY = 0;
    chicken_hit = new Audio("assets/audio/chick_hit.mp3");
    IMAGES_WALKING = [
        "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ];

    IMAGES_DEAD = [
        "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
        "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
    ];

    constructor(i) {
        super(i)
        this.loadImage("assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.height = 25;
        this.width = 25;
        this.y = 415;
        this.applyGravity()
        this.jump()
    };

    /**
     * Executes the jumping action.
     */
    jump() {
        setInterval(() => {
            this.jumpInterval(), Math.round(Math.random() * 1800)
        }, + 600);
    };

    /**
     * Initializes the jumping interval.
     */
    jumpInterval() {
        this.speedY = Math.round(Math.random() * 4);
    };

    chickDead() {
        clearInterval(this.animation_interval);
        this.offset.width = 0;
        this.offset.height = 0;
        this.offset.y = 500;
        if (sound == true) this.chicken_hit.play();
        this.loadImage("assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png");
    };
};