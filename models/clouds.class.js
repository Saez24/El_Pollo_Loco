class Clouds extends MovableObject {
    /**
     * Creates a new instance of the class.
     *
     * @param {number} position_x - The x-coordinate position of the instance.
     * @param {number} position_y - The y-coordinate position of the instance.
     * @param {number} speed - The speed of the instance.
     * @param {string} imagePath - The path to the image of the clouds.
     */
    constructor(position_x, position_y, speed, imagePath) {
        super(position_x, position_y, speed);
        this.loadImage(imagePath);
        this.width = 300;
        this.height = 200;
        this.animate();
    };
};