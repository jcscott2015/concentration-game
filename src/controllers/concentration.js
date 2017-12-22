// Rules for Concentration
export class Concentration {
  /**
   * constructor
   */
  constructor() {
    this.card;
    this.compare = [];
  }

  /**
   * Set selected card and prepare for comparison.
   * @param {obj} card
   */
  setCard(card) {
    let notFound = true;
    [...this.compare].forEach(compareCard => {
      if (card.code === compareCard.code) {
        notFound = false;
      }
    });

    if (notFound) {
      this.card = card;
      this.addToCompare();
    }
  }

  /**
   * Add card to compare array.
   * Empty compare array if more than 2.
   * Empty the current selection.
   */
  addToCompare() {
    if (this.compare.length >= 2) this.compare = [];
    this.compare.push(this.card);
  }

  /**
   * Returns the compare array.
   */
  getCompare() {
    return this.compare;
  }

  /**
   * Check if two cards match values
   * @returns {array} matched card objects or first card object if not matched.
   */
  checkMatch() {
    if (this.compare.length == 2) {
      if (this.compare[0].value !== this.compare[1].value) {
        this.compare = [];
      }
    }
    return this.compare;
  }
}
