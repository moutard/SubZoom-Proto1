'use strict';

/**
 * Bag Of Words.
 *
 * List of words present in the doc with their score. So the dna can be
 * represented as a vector.
 * Score can be frequency for example, but we can imagine more sophisticated
 * with bonus if the words was copy pasted or highlighted. But this intelligence
 *  shouldn't be in the bag of words structure.
 */

Cotton.Model.BagOfWords = Class.extend({

  /**
   * {Dictionnary} _lBag:
   *  - key: {String} word
   *  - value: {Float} score of the word. Bigger means that this word is
   *  more important in this document.
   *
   *  Advantages of dictionnary structure :
   *  words are sorted by alphabetical order. So easy to made a vector mode.
   */
  _lBag : {},

  init : function() {
    var self = this;
  },

  addWord : function(sWord, iScore) {
    this._lBag[sWord] = iScore;
  },

  increaseWordScore : function(sWord, iScore) {
    this._lBag[sWord] += iScore;
  },

  get : function() {
    return this._lBag;
  },
});