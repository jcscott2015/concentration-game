import './favicons/favicons';
import './css/reboot.css';
import './scss/index.scss';
import { LayoutCards } from './controllers/layout-cards';

let startBtn = document.getElementById('new-game');
startBtn.addEventListener('click', function () {
  const gameArea = document.getElementById('game-area');

  // Destroy any old game
  if (document.getElementById('game')) {
    const game = document.getElementById('game');
    game.parentNode.removeChild(game);
  }

  // Create game
  let layoutCards = new LayoutCards();
  gameArea.appendChild(layoutCards.getLayout());
});
