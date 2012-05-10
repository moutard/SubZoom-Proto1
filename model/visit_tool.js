'use strict';

// TODO(rmoutard) : I had this crazy idea. Do not store the tools in the
// visitItems store.
// Why ? because it's allow to keep a reasonnable size of visitItems store. And
// this will increase the speed. of the whole software.

// VisitTools is clearly a copy of visitItems
Cotton.Model.VisitTools = Class
    .extend({
      init : function() {

        this._sId; // visitId.
        this._sChromeVisitId; // Should be the same that Google chrome history.

        // Information of historyItem that are pertinent with this model.
        this._sUrl;
        this._sTitle;
        this._iVisitTime;

        // Informations of historyItem that are NOT pertinent th this model.
        // this._iLastVisitTime;
        // this._iVisitCount;
        // this._iTypedCount;

        // Added by preTreatment
        // this._oUrl ?
        this._sPathname;
        this._sHostname;
        this._lQueryWords;
        this._lExtractedWords;
        this._sClosestGeneratedPage;

        // Improved model - only available for DBSCAN2
        // TODO(rmoutard) : see with fwouts the model of textHighLigter
        // this._lTextHighlighter = [];
        // this._iScrollCount = 0;
        // this._lCopyPaste = [];
        // this._lPScore = []; // array of dictionnary {p:"text de p", score :
        // "score
        // de
        // p"}

      },
      // GETTER
      // can't be set
      id : function() {
        return this._sId;
      },
      chromeId : function() {
        return this._sChromeId;
      },
      url : function() {
        return this._sUrl;
      },
      title : function() {
        return this._sTitle;
      },
      visitTime : function() {
        return this._iVisitTime;
      },

      //
      pathname : function() {
        return this._sPathname;
      },
      setPathname : function(sPathname) {
        this._sPathname = sPathname;
      },
      hostname : function() {
        return this._sHostname;
      },
      setHostname : function(sHostname) {
        this._sHostname = sHostname;
      },
      queryWords : function() {
        return this._lQueryWords;
      },
      setQueryWords : function(lQueryWords) {
        this._lQueryWords = lQueryWords;
      },
      extractedWords : function() {
        return this._lExtractedWords;
      },
      setExtractedWords : function(lExtractedWords) {
        this._lExtractedWords = lExtractedWords;
      },
      closestGeneratedPage : function() {
        return this._sClosestGeneratedPage;
      },
      setClosestGeneratedPage : function(sClosestGeneratedPage) {
        this._sClosestGeneratedPage = sClosestGeneratedPage;
      },
      // expanded
      textHighLighter : function() {
        return this._sTextHighlighter;
      },
      setTextHighLighter : function(highLight) {
        this._sTextHighlighter.push(highLight);
      },
      scrollCount : function() {
        return this._iScrollCount;
      },
      setScrollCount : function(scrollCount) {
        this._iScrollCount = scrollCount;
      },
      copyPaste : function() {
        return this._lCopyPaste;
      },
      setCopyPaste : function(copyPaste) {
        this._lCopyPaste.push(copyPaste);
      },
      pScore : function() {
        return this._lPScore;
      },
      setPScore : function(dNewP) {
        var i = _.indexOf(_.pluck(this._lPScore, "p"), dNewP);
        if (i !== -1) {
          this._lPScore[i].score = dNewP.score; // TODO(rmoutard) : check +=
        } else {
          this._lPScore.push(dNewP);
        }
      },
      // method
      getInfoFromPage : function() {
        this._sUrl = window.location.href;
        this._sTitle = document.title;
        this._iLastVisitTime = new Date().getTime();

        // This method is called in a content_script, but due to chrome
        // security
        // options maybe not work if not called by the extension.
        /*
         * chrome.history.getVisits({ 'url' : this._sUrl },
         * function(lVisitItems) { if(lVisitItems.length > 0){this._sChromeId =
         * lVisitItem[0].id; } } );
         */
      },
      concat : function(oNewVisitItem) {
        // TODO(rmoutard) : check the default value is undefined.
        if (oNewVisitItem.id() === undefined
            && oNewVisitItem.url() === this.url()) {
          // TODO(rmoutard) : depends on how you update historyItem
          // in the file content_script_listener.
          this._sTextHighlighter = concat(this._sTextHighlighter,
              oNewVisitItem.textHighLighter);
          this.setScrollCount(oNewVisitItem.scrollCount());
          // TODO(rmoutard) complete the list.
        } else {
          console
              .log("Conflict : Can't update historyItem with two differents id");
        }
      },
      deserialize : function(dVisitItemSerialized) {
        this._sId = dVisitItemSerialized._sId || undefined;
        this._sChromeVisitId = dVisitItemSerialized || undefined;

        this._sUrl = dVisitItemSerialized._sUrl;
        this._sTilte = dVisitItemSerialized._sTitle;
        this._iVisitTime = dVisitItemSerialized._iVisitTime;

        this._lTextHighlighter = dVisitItemSerialized._lTextHighlighter;
        this._iScrollCount = dVisitItemSerialized._iScrollCount;
        this._lCopyPaste = dVisitItemSerialized._lCopyPaste;
        this._lPScore = dVisitItemSerialized._lPScore;
      },
    });
