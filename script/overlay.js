/**
 * Generates the game overlay based on the game state.
 *
 * @return {undefined} This function does not return a value.
 */
function gameOverlay() {
    let gameOver = document.getElementById("game-overlay");
    gameOver.innerHTML = "";
    if (!characterAlive) {
        stopGame();
        gameOver.innerHTML =/*html*/`
            <div id="game-over">
                <div>GAME</div>
                <div>OVER</div>
            </div>
            <div id="restart" onclick="restartGame()">
                TRY AGAIN
            </div>
        ` ;
        gameOver.classList.remove("d-none");
    } else if (characterAlive && !bossAlive) {
        stopGame();
        gameOver.innerHTML =/*html*/`
            <div id="winning-screen">
                <div>CONGRATULATIONS</div>
                <img id="win" src="assets/img/10_interaction/trophy.png" alt="">
            </div>
            <div id="restart" onclick="restartGame()">
                PLAY AGAIN
            </div>
        ` ;
        gameOver.classList.remove("d-none");
    } else {
        gameOver.innerHTML = /*html*/`
            <div class="menu">
                <img class="menu-btn" onclick="changeMusic('game-music-btn')" id="game-music-btn"
                    src="assets/img/10_interaction/music.png" alt="">
                <img class="menu-btn" onclick="changeSound('game-sound-btn')" id="game-sound-btn"
                    src="assets/img/10_interaction/speaker.png" alt="">
                <img class="menu-btn" onclick="fullScreen(),restartGame()" id="full_screen-btn"
                    src="assets/img/10_interaction/fullScreen.png" alt="">
            </div>
            <div onclick="restartGame()" class="restart">RESTART</div>
        `;
    }

}