/*eslint-disable no-console*/
/**
 * Adds card flipping animation to game cards.
 * Uses CSS3 styles to animate.
 */
export class FlipCards {
  /**
   * Constructor
   * @param {str} cardClass
   * @param {str} sideClass
   */
  constructor(cardClass, sideClass) {
    this.cardClass = cardClass;
    this.sideClass = sideClass;
  }

  /**
   * Adds click event to parent that toggles the flip class of the children.
   */
  addFlipEvent() {
    const self = this;
    let allCards = document.getElementsByClassName(self.cardClass);
    [...allCards].forEach(card => {
      card.addEventListener('click', function () {
        let sides = this.getElementsByClassName(self.sideClass);
          [...sides].forEach(side => {
          side.classList.toggle('flip');
        });
      });
    });
  }
}
