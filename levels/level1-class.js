let background = [];
let cloud = [];
let enemies = [];
let coins = [];
let bottles = [];

/**
 * Class responsible for initializing level components.
 */
class LevelInitializer {
    constructor() {
        this.initializeLevel();
    }

    /**
     * Generates an array of Bottle objects with specified properties.
     */
    generateBottleArray() {
        bottles = [
            new Bottle(300, "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 30),
            new Bottle(350, "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 30),
            new Bottle(250, "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 30),
            new Bottle(550, "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 20),
            new Bottle(400, "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 20),
            new Bottle(600, "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 30),
            new Bottle(700, "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 20),
            new Bottle(1100, "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 20),
            new Bottle(1150, "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 30),
            new Bottle(1600, "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 30),
            new Bottle(1800, "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 30),
            new Bottle(1850, "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 30),
            new Bottle(1900, "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 30),
            new Bottle(1950, "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 30)
        ];
    }

    /**
     * Generates an array of Coin objects and fills it with initial values.
     */
    generateCoinArray() {
        coins = [
            new Coin(200, 100),
            new Coin(300, 100),
            new Coin(250, 50),
            new Coin(350, 50),
            new Coin(400, 100),
            new Coin(1100, 100),
            new Coin(1100, 50),
            new Coin(1050, 100),
            new Coin(1050, 50),
            new Coin(1500, 200),
            new Coin(1550, 200),
            new Coin(1600, 200),
            new Coin(1900, 100),
            new Coin(1850, 150),
            new Coin(1900, 200),
            new Coin(1950, 150)
        ];
    }

    /**
     * Generates the background objects array and fills it with initial values.
     */
    generateBackgroundArray() {
        background = [];
        for (let i = 0; i <= 4; i++) {
            background.push(new Sky(720 * i, 0));
            background.push(new Background(720 * i, this.y - 1, 3));
            background.push(new Background(720 * i, this.y - 1, 2));
            background.push(new Background(720 * i, this.y - 1, 1));
        }
    }

    /**
     * Generates an array of cloud objects and returns it.
     */
    generateCloudArray() {
        for (let i = 0; i < 6; i++) {
            cloud.push(new Clouds(Math.random() * (700) + (i * 720), Math.random() * 100, 0.3, "assets/img/5_background/layers/4_clouds/1.png"));
            cloud.push(new Clouds(Math.random() * (700) + (i * 720), Math.random() * 100, 0.3, "assets/img/5_background/layers/4_clouds/1.png"));
            cloud.push(new Clouds(Math.random() * (700) + (i * 720), Math.random() * 100, 0.2, "assets/img/5_background/layers/4_clouds/2.png"));
            cloud.push(new Clouds(Math.random() * (700) + (i * 720), Math.random() * 100, 0.2, "assets/img/5_background/layers/4_clouds/2.png"));
        }
        return cloud;
    }

    /**
     * Generates an array of enemy objects.
     */
    generateEnemyArray() {
        enemies = [];
        for (let i = 1; i < 4; i++) {
            enemies.push(new Chicken(i));
            enemies.push(new Chick(i));
            enemies.push(new Chicken(i));
            enemies.push(new Chick(i));
            enemies.push(new Chicken(i));
            enemies.push(new Chick(i));
            enemies.push(new Chicken(i));
            enemies.push(new Chick(i));
        }
    }

    /**
     * Fills the level with coins, background objects, clouds, enemies, and bottles.
     */
    initializeLevel() {
        this.generateCoinArray();
        this.generateBackgroundArray();
        this.generateCloudArray();
        this.generateEnemyArray();
        this.generateBottleArray();
    }
}

// Create an instance of LevelInitializer to initialize the level
const levelInitializer = new LevelInitializer();

/**
 * Resets the level with the given enemies, background array, cloud array, coins, and bottles.
 *
 * @param {Array} enemies - The enemies for the level.
 * @param {Array} background - The background array for the level.
 * @param {Array} cloud - The cloud array for the level.
 * @param {Array} coins - The coins for the level.
 * @param {Array} bottles - The bottles for the level.
 */
function resetLevel(enemies, background, cloud, coins, bottles) {
    level1 = new Level(
        enemies,
        background,
        cloud,
        coins,
        bottles
    );
}

let level1 = new Level(
    enemies,
    background,
    cloud,
    coins,
    bottles
);

