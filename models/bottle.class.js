class Bottle extends DrawableObject {
    /**
     * Constructor for the class.
     *
     * @param {type} x - description of the x parameter
     * @param {type} path - description of the path parameter
     * @param {type} offset - description of the offset parameter
     * @return {type} description of the return value
     */
    constructor(x, path, offset) {
        super();
        this.x = x;
        this.y = 385;
        this.loadImage(path);
        this.width = 70;
        this.height = 60;
        this.offset = {
            width: 30,
            height: 50,
            x: x + offset,
            y: 385,
        }
    };
};