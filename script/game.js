let canvas;
let world;
let gameStopped = false;
let characterAlive = true;
let bossAlive = true;
let keyboard = new Keyboard();
let intervalIds = [];
let backgroundMusic = new Audio("assets/audio/backgroundMusic.mp3");
let chicken_walk = new Audio("assets/audio/chicken.mp3");
let intro_music = new Audio("assets/audio/bossIntro.mp3");
let winning_sound = new Audio("assets/audio/win.mp3");
let sound = true;
let music = true;
let fullscreen = false;
let mobileControlIds = ["left", "right", "jump", "throw"];

/**
 * Initializes the canvas and sets up the world object.
 *
 * @return {void} This function does not return anything.
 */
function init() {
    hideStartScreen();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    addEnemyAnimationIntervals();
};

/**
 * Adds animation intervals of all enemies in the world to the intervalIds array.
 */
function addEnemyAnimationIntervals() {
    world.level.enemies.forEach((enemy) => {
        intervalIds.push(enemy.animation_interval);
    });
};

/**
 * Initializes keydown event listener to update keyboard state based on pressed keys.
 */
function initializeKeyDownListener() {
    window.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "ArrowLeft":
                keyboard.KEY_LEFT = true;
                keyboard.KEY_RIGHT = false;
                break;
            case "ArrowRight":
                keyboard.KEY_RIGHT = true;
                keyboard.KEY_LEFT = false;
                break;
            case "ArrowUp":
                keyboard.KEY_UP = true;
                break;
            case "ArrowDown":
                keyboard.KEY_DOWN = true;
                break;
            case "KeyD":
                keyboard.KEY_THROW = true;
                break;
        }
    });
};

/**
 * Initializes keyup event listener to update keyboard state when keys are released.
 */
function initializeKeyUpListener() {
    window.addEventListener("keyup", (event) => {
        switch (event.code) {
            case "ArrowLeft":
                keyboard.KEY_LEFT = false;
                break;
            case "ArrowRight":
                keyboard.KEY_RIGHT = false;
                break;
            case "ArrowUp":
                keyboard.KEY_UP = false;
                break;
            case "ArrowDown":
                keyboard.KEY_DOWN = false;
                break;
            case "KeyD":
                keyboard.KEY_THROW = false;
                break;
        }
    });
};

/**
 * Executes the necessary actions for mobile interaction.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function mobileListener() {
    initializeKeyDownListener();
    initializeKeyUpListener();
    initializeMobileControlListeners();
    releaseMobileControl();
};

/**
 * Initializes touch event listeners for mobile controls to update keyboard state.
 */
function initializeMobileControlListeners() {
    mobileControlIds.forEach((id) => {
        document.getElementById(id).addEventListener("touchstart", (event) => {
            switch (id) {
                case "left":
                    keyboard.KEY_LEFT = true;
                    break;
                case "right":
                    keyboard.KEY_RIGHT = true;
                    break;
                case "jump":
                    keyboard.KEY_UP = true;
                    break;
                case "throw":
                    keyboard.KEY_THROW = true;
                    break;
            }
            event.preventDefault();
        });
    });
};

/**
 * Releases mobile button states when touchend event is triggered.
 *
 * @param {string} id - The id of the button.
 */
function releaseMobileControl(id) {
    mobileControlIds.forEach((id) => {
        document.getElementById(id).addEventListener("touchend", (event) => {
            switch (id) {
                case "left":
                    keyboard.KEY_LEFT = false;
                    break;
                case "right":
                    keyboard.KEY_RIGHT = false;
                    break;
                case "jump":
                    keyboard.KEY_UP = false;
                    break;
                case "throw":
                    keyboard.KEY_THROW = false;
                    break;
            }
            event.preventDefault();
        });
    });
};

/**
 * Stops the game, initializes the level, and resets it.
 */
function stopGame() {
    for (let i = 0; i < 99999; i++) {
        clearInterval(i);
    }
    cancelAnimationFrame(world.drawId);
    levelInitializer.initializeLevel();
    resetLevel(enemies, background, cloud, coins, bottles);
    characterAlive = true;
    bossAlive = true;
    gameStopped = true;
};

/**
 * Restarts the game.
 *
 * @return {undefined} - No return value.
 */
function restartGame() {
    if (!gameStopped) stopGame();
    canvas = document.getElementById('canvas');
    closeGameMenu();
    init();
    gameStopped = false;
};

/**
 * Clears the world by setting the level1 and world variables to null.
 * Removes the 'mousemove' event listener for the canvas, which triggers the showMousePosition function.
 * Removes the 'keydown' and 'keyup' event listeners for the window.
 */
function clearWorld() {
    level1 = null;
    world = null;
    window.removeEventListener("keydown", function () { });
    window.removeEventListener("keyup", function () { });
};