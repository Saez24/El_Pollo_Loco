class Statusbar extends DrawableObject {
    percentage = 0;
    IMAGES = [];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.height = 50;
        this.width = 180;
    };

    /**
     * Sets the percentage value and updates the image accordingly.
     *
     * @param {number} percentage - The percentage value to be set.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    };

    /**
     * Resolves the image index based on the current percentage.
     *
     * @return {number} The index of the image to be displayed.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 0;
        } else if (this.percentage >= 80) {
            return 1;
        } else if (this.percentage >= 60) {
            return 2;
        } else if (this.percentage >= 40) {
            return 3;
        } else if (this.percentage >= 20) {
            return 4;
        } else if (this.percentage >= 0) {
            return 5;
        } else {
            return 5;
        }
    };
};