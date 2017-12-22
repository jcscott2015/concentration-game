import { getNewDeck } from '../model/get-cards';
import { CardImages } from '../controllers/card-images';
import { Concentration } from '../controllers/concentration';
import { setTimeout } from 'timers';

/**
 * Use WebPack to load card images.
 */
const cardImages = new CardImages();
const cardBack = cardImages.getCardBack();
const cardFaces = cardImages.gatherCardFaces();

/**
 * Methods for game play
 */
const concentration = new Concentration();

/**
 * Get cards from api and layout the game board.
 */
export class LayoutCards {
  /**
   * Constructor for LayoutCards
   * @param {obj} options override defaults
   */
  constructor(options = {}) {
    const defaults = {
      cardClass: 'card',
      sideClass: 'side',
      flipClass: 'flip',
      frontClass: 'front',
      backClass: 'back',
      layoutId: 'game',
      flipBackTimeout: 2000
    };

    // overwrite defaults
    this.options = Object.assign(defaults, options);

    this.layout = document.createElement('div');
    this.layout.id = this.options.layoutId;

    this.constructGame();
  }

  /**
   * Returns game layout DOM.
   */
  getLayout() {
    return this.layout;
  }

  /**
   * Adds user friendly error string to game layout DOM.
   * @param {str} error
   */
  displayException(error) {
    let errorEl = document.createElement('p');
    let errorText = document.createTextNode(error);
    errorEl.appendChild(errorText);
    this.layout.appendChild(errorEl);
  }

  /**
   * Gets api data and uses Promise result to construct game layout.
   */
  constructGame() {
    getNewDeck()
      .then(result => {
        if (typeof result === 'undefined') {
          console.error("Result is undefined."); // eslint-disable-line no-console
          throw this.displayException("Oh my, there was a problem dealing the cards! Check your internet connection.")
        }
        for (let c = 0; c < result.cards.length; c++) {
          let cards = result.cards[c];
          let cardWrapper = this.buildCard({
            'code': cards.code,
            'value': cards.value,
            'suit': cards.suit,
            'image': this.parseCardImageNames(cards)
          });
          this.layout.appendChild(cardWrapper);
        }
      });
  }

  /**
   * Parses card object from result to link to local card images.
   * @param {obj} card
   */
  parseCardImageNames(card) {
    let imageName = [card.value, card.suit].join('_of_').toLowerCase();
    return imageName;
  }

  /**
   * Adds click event to parent that toggles the flip class of the children.
   * @param {obj} cardWrapper DOM object
   */
  addFlipEvent(cardWrapper) {
    // We need to pass these constructor variables to cardWrapper to avoid addEventListener closure issues.
    cardWrapper.flipClass = this.options.flipClass;
    cardWrapper.sideClass = this.options.sideClass;
    cardWrapper.addEventListener('click', this.flipCard);
  }

  /**
   * Card flip action
   */
  flipCard() {
    const cardWrapper = this;
    if (cardWrapper.getAttribute('data-flipped') === 'true') {
      cardWrapper.setAttribute('data-flipped', false);
    } else {
      cardWrapper.setAttribute('data-flipped', true);
    }

    let sides = cardWrapper.getElementsByClassName(cardWrapper.sideClass);
    [...sides].forEach(side => side.classList.toggle(cardWrapper.flipClass));
  }

  /**
   * Checks if the selected cards match values.
   * NOTE: should be registered after the addFlipEvent.
   * @param {obj} cardWrapper DOM object
   */
  addSelectCardEvent(cardWrapper) {
    // We need to pass this reference to LayoutCards class to cardWrapper to avoid addEventListener closure issues.
    cardWrapper.scope = this;
    cardWrapper.addEventListener('click', this.cardCheck);
  }

  /**
   * Set the selected card and compare it to another, if available.
   */
  cardCheck() {
    const cardWrapper = this;
    concentration.setCard(cardWrapper.card);
    cardWrapper.scope.checkMatch();
    cardWrapper.scope.freezeSelected(cardWrapper);
  }

  /**
   * Check if two selected cards have matched values.
   * 1. Freeze all card click events on unmatched cards.
   * 2. If no match, after a set time unfreeze all unmatched
   *    cards and flip over the selected cards.
   * 3. If a match, unfreeze all unmatched cards and
   *    set matched cards' data-matched to true
   */
  checkMatch() {
    let compareThese = concentration.getCompare();
    if (compareThese.length == 2) {
      // freeze click events on all unmatched cards
      this.freezeUnmatched();

      let matched = concentration.checkMatch();
      if (matched.length > 0) {
        [...matched].forEach(card => {
          let selected = document.getElementById(card.code);
          selected.setAttribute('data-matched', true);
          this.freezeSelected(selected);
        });

        // unfreeze click events on all unmatched cards
        this.unfreezeUnmatched();
      } else {
        setTimeout(() => {
          [...compareThese].forEach(cardWrapper => {
            let compareCard = document.getElementById(cardWrapper.code);
            compareCard.setAttribute('data-flipped', false);
            let sides = compareCard.getElementsByClassName(this.options.sideClass);
            // flip cards over
          [...sides].forEach(side => side.classList.remove(this.options.flipClass));
          });

          // unfreeze click events on all unmatched cards
          this.unfreezeUnmatched();
        }, this.options.flipBackTimeout);
      }
    }
  }

  /**
   * Freeze click events on all selected card.
   */
  freezeSelected(cardWrapper) {
    cardWrapper.removeEventListener('click', this.flipCard);
    cardWrapper.removeEventListener('click', this.cardCheck);
  }

  /**
   * Freeze click events on all unmatched cards.
   */
  freezeUnmatched() {
    const unMatchedCards = this.getUnmatchedCards();
    [...unMatchedCards].forEach(cardWrapper => {
      // remove click flip event listener
      cardWrapper.removeEventListener('click', this.flipCard);
      // remove click event to compare 2 selected cards
      cardWrapper.removeEventListener('click', this.cardCheck);
    });
  }

  /**
   * Unfreeze click events on all unmatched cards.
   */
  unfreezeUnmatched() {
    const unMatchedCards = this.getUnmatchedCards();
    [...unMatchedCards].forEach(cardWrapper => {
      // add click flip event listener
      this.addFlipEvent(cardWrapper);
      // add click event to compare 2 selected cards
      this.addSelectCardEvent(cardWrapper);
    });
  }

  /**
   * Return a reference to all unmatched cards.
   */
  getUnmatchedCards() {
    return document.querySelectorAll('[data-matched = "false"]');
  }

  /**
   * Constructs DOM elements for each result item.
   * @param {obj} card
   */
  buildCard(card) {
    // card wrapper
    let cardWrapper = document.createElement('div')
    cardWrapper.className = this.options.cardClass;
    cardWrapper.id = card.code;
    cardWrapper.setAttribute('data-value', card.value);
    cardWrapper.setAttribute('data-suit', card.suit);
    cardWrapper.setAttribute('data-matched', false);
    cardWrapper.setAttribute('data-flipped', false);
    // Store the card data in the cardWrapper DOM for rasy access.
    cardWrapper.card = card;

    // back with card image element
    let back = document.createElement('div');
    back.className = [this.options.sideClass, this.options.backClass].join(' ');
    let backImg = document.createElement('img');
    backImg.src = cardBack;
    backImg.alt = 'Card Back Image';
    back.appendChild(backImg);

    // front with card image element
    let front = document.createElement('div');
    front.className = [this.options.sideClass, this.options.frontClass].join(' ');
    let frontImg = document.createElement('img');
    frontImg.src = cardFaces[card.image];
    frontImg.alt = [card.value, card.suit].join(' of ').toLowerCase();
    front.appendChild(frontImg);

    // append back and front to card
    cardWrapper.append(back, front);

    // add click flip event listener
    this.addFlipEvent(cardWrapper);

    // add click event to compare 2 selected cards
    this.addSelectCardEvent(cardWrapper);

    return cardWrapper;
  }
}
