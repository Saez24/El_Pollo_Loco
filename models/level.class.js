class Level {
    level_limit = 2880;
    enemies;
    backgroundObjects;
    clouds;
    coins;
    bottles

    constructor(enemies, backgroundObjects, clouds, coins, bottles) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.clouds = clouds;
        this.coins = coins;
        this.bottles = bottles;
    }
}