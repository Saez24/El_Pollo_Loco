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
    pushExtraIntervals();
};


/**
 * Adds a keydown event listener to the window and updates the keyboard object based on the pressed keys.
 *
 * @param {Event} event - The keydown event object.
 * @return {void} This function does not return a value.
 */
function addKeyDown() {
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
            case "Space":
                keyboard.KEY_SPACE = true;
                break;
            case "Shift":
                keyboard.KEY_THROW = true;
                break;
            case "KeyD":
                keyboard.KEY_THROW = true;
                break;
        };
    })
};


/**
 * Adds an event listener for the "keyup" event on the window object.
 * When a key is released, it updates the corresponding property in the "keyboard" object.
 *
 * @param {Event} event - The keyup event object.
 * @return {undefined} This function does not return a value.
 */
function addKeyUp() {
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
            case "Space":
                keyboard.KEY_SPACE = false;
                break;
            case "Shift":
                keyboard.KEY_THROW = false;
                break;
            case "KeyD":
                keyboard.KEY_THROW = false;
                break;
        };
    });
};


/**
 * Executes the necessary actions for mobile interaction.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function mobileListener() {
    addKeyDown();
    addKeyUp();
    pressMobileBtn();
    releaseMobileBtn();
}


/**
 * Listens for touch events on mobile devices and updates the keyboard state accordingly.
 *
 * @param {none} 
 * @return {none}
 */
function pressMobileBtn() {
    mobileControlIds.forEach((id) => {
        document.getElementById(id).addEventListener("touchstart", (event) => {
            if (id == "left") {
                keyboard.KEY_LEFT = true;
                event.preventDefault()
            }
            if (id == "right") {
                keyboard.KEY_RIGHT = true;
                event.preventDefault()
            }
            if (id == "jump") {
                keyboard.KEY_UP = true;
                event.preventDefault()
            }
            if (id == "throw") {
                keyboard.KEY_THROW = true;
                event.preventDefault()
            }
        })
    })
};


/**
 * Releases the mobile button when touchend event is triggered.
 *
 * @param {string} id - The id of the button.
 * @return {void} 
 */
function releaseMobileBtn() {
    mobileControlIds.forEach((id) => {
        document.getElementById(id).addEventListener("touchend", (event) => {
            if (id == "left") {
                keyboard.KEY_LEFT = false;
                event.preventDefault()
            }
            if (id == "right") {
                keyboard.KEY_RIGHT = false;
                event.preventDefault()
            }
            if (id == "jump") {
                keyboard.KEY_UP = false;
                event.preventDefault()
            }
            if (id == "throw") {
                keyboard.KEY_THROW = false;
                event.preventDefault()
            }
        })
    })
};


/**
 * Executes the given function at regular intervals.
 *
 * @param {function} func - The function to be executed.
 * @param {number} time - The time interval in milliseconds.
 */
function interval(func, time) {
    let boundFunc = func.bind(this);
    let intervalId = setInterval(boundFunc, time);
    intervalIds.push(intervalId);
};


/**
 * Pushes the animation intervals of all enemies in the world to the intervalIds array.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function pushExtraIntervals() {
    world.level.enemies.forEach((e) => { intervalIds.push(e.animation_interval) })
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
}

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