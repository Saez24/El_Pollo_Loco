class Splash extends MovableObject {

    IMAGES_SPLASH = [
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png"
    ];


    /**
     * Creates a new instance of the class.
     *
     * @param {type} x - The value of x.
     * @param {type} y - The value of y.
     */
    constructor(x, y) {
        super()
        this.x = x;
        this.y = y - 15;
        this.loadImage(this.IMAGES_SPLASH[0])
        this.loadImages(this.IMAGES_SPLASH);
        this.width = 50;
        this.height = 50;
        this.splash();
    };


    /**
     * Plays the splash animation and sets the object to a fading out state when the animation ends.
     *
     * @return {void}
     */
    splash() {
        let splash_interval = setInterval(() => {
            this.playAnimation(this.IMAGES_SPLASH);
            if (this.currentImage == this.IMAGES_SPLASH.length - 1) {
                clearInterval(splash_interval);
                splash_interval = null;
                this.isFadingOut = true;
            }
        }, 1000 / 30);
    };
};