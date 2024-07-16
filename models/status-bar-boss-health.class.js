class BossHealth extends Statusbar {
    percentage = 100;
    height = 35;
    width = 180;
    x;

    IMAGES = [
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.y = -40;
        this.setPercentage(100);
    };
}