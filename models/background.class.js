class Background extends MovableObject {
    /**
     * Constructor function for creating a new instance of the class.
     *
     * @param {number} position_x - The x-coordinate of the position.
     * @param {number} y - The y-coordinate of the position.
     * @param {number} layer - The layer number (1, 2, or 3).
     */
    constructor(position_x, y, layer) {
        super(position_x, y);
        this.setPropertiesByLayer(layer);
    }

    /**
     * Sets properties (image, width, height, y-position) based on the layer.
     *
     * @param {number} layer - The layer number (1, 2, or 3).
     */
    setPropertiesByLayer(layer) {
        switch (layer) {
            case 1:
                this.loadImage("assets/img/5_background/layers/1_first_layer/full.png");
                this.width = 720;
                this.height = 320;
                this.y = 480 - this.height;
                break;
            case 2:
                this.loadImage("assets/img/5_background/layers/2_second_layer/full.png");
                this.width = 720;
                this.height = 380;
                this.y = 430 - this.height;
                break;
            case 3:
                this.loadImage("assets/img/5_background/layers/3_third_layer/full.png");
                this.width = 720;
                this.height = 420;
                this.y = 380 - this.height;
                break;
            default:
                throw new Error("Invalid layer number");
        }
    }
}