class Sky extends MovableObject {
    constructor(position_x, position_y) {
        super(position_x, position_y);
        this.loadImage("assets/img/5_background/layers/air.png");
        this.width = 721;
        this.height = 480;
    }
}