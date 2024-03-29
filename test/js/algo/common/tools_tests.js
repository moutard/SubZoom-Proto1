'use strict';
module(
    "Cotton.Algo.Tools",
    {
      setup : function() {

      },
      teardown : function() {
        // runs after each test
      }
    }
);


test("extract words on empty title.", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle(""), []);
});

test("extract words on Jennifer Anniston title.", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle("Jennifer Anniston"),
    ['jennifer', 'anniston']);
});

test("extract words on less than 2 letters words. ", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle("ou est donc or ni car ?"),
    ['est', 'donc', 'car']);
});

test("extract words on less than 2 letters words with punctuation.", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle("ou est donc or ni car."),
    ['est', 'donc', 'car']);
});

test("extract words from url. ", function() {
  var sUrl = "http://example.com/what_are_the_words_in_this_url";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['what', 'are', 'the', 'words', 'this', 'url']);


  var sUrl = "http://techcrunch.com/2013/02/19/yota-to-mass-produce-e-ink-phone-in-singapore/";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['2013', 'yota', 'mass', 'produce', 'ink', 'phone', 'singapore']);

});

