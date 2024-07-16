class StatusBarBottle extends Statusbar {
    percentage = 100;

    IMAGES = [
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png"
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 42;
        this.setPercentage(100);
    }
}