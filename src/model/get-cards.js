import 'whatwg-fetch';

/**
 * Return promise of new shuffled deck of cards.
 */
export function getNewDeck() {
  return get('new', 52);
}

/**
 * Returns cards drawn from a new or existing deck using the deckofcardsapi.
 * @param {str} deckId - 'new' or deck id number.
 * @param {int} cardCount - number of cards
 */
function get(deckId, cardCount) {
  return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${cardCount}`).then(onSuccess, onError);
}

/**
 * Returns json object on success of get fetch.
 * @param {obj} response
 */
function onSuccess(response) {
  return response.json();
}

/**
 * Returns error of get fetch.
 * @param {obj} error
 */
function onError(error) {
  console.error(`Error geting the cards. ${error}`); // eslint-disable-line no-console
}
