import cardBack from '../img/playing-card-back.png';

/**
 * Gathers and filters all card face images.
 */
export class CardImages {
  /**
   * Get card back image.
   */
  getCardBack() {
    return cardBack;
  }

  /**
   * Determine browser support for SVG as an image.
   */
  svgAsImg() {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
  }

  /**
   * Collect a filtered list of all card face images.
   * @param {obj} r webpack require.context result
   */
  importAll(r) {
    let collection = {};
    r.keys().map(item => {
      collection[item.replace(/\.\/(.+?)(\.[^.]*$|$)/, '$1')] = r(item);
    });
    return collection;
  }

  gatherCardFaces() {
    let faces;
    if (this.svgAsImg) {
      faces = this.importAll(require.context('../img/svg', false, /\.svg$/));
    } else {
      faces = this.importAll(require.context('../img/png', false, /\.png$/));
    }
    return faces;
  }
}
