'use strict';

// PreTreatment Workspace
Cotton.Algo.PreTreatment = {};


// PreTreatment is used in the worker, so all data received are serialized.
// That's why, lVisitItem is a list of Object. And not a list of 
// Cotton.Model.VisitItem.
// TODO(rmoutard) : discuss about the idea of using deserialized function.
Cotton.Algo.PreTreatment.removeTools = function(lVisitItems) {
  // Remove all the tools as mail.google.com, facebook.com.

  var oToolsContainer = generateTools(); // return a list of Tools
  var lCleanHistoryItems = new Array(); // Store the new list without tools

  // TODO(rmoutard) : use _.filter function in underscore library
  while (lVisitItems.length > 0) {
    var oVisitItem = lVisitItems.shift();
    var sHostname = new parseUrl(oVisitItem._sUrl).hostname;

    // if hostname of the url is a Tool remove it
    if (oToolsContainer.alreadyExist(sHostname) === -1) {
      lCleanHistoryItems.push(oVisitItem);
    }
  }
  return lCleanHistoryItems;
};

Cotton.Algo.PreTreatment.computeClosestGeneratedPage = function(lVisitItems) {
  // For all historyItems find the closest page generated by a search with
  // query keywords. Store this keywords on the object.

  var iSliceTime = Cotton.Config.Parameters.iSliceTime;
  // After this time a page is considered as non-linked with a query search page
  var sNonFound = "http://www.google.fr/";
  var oCurrentSearchPage = {
    _sUrl : "http://www.google.fr/",
    _iVisitTime : 0
  };

  for ( var i = lVisitItems.length - 1; i >= 0; i--) {
    // Inverse Loop.
    // This method is working because lVisitItems is sorted by iVisitTime.

    var oUrl = new parseUrl(lVisitItems[i]._sUrl);
    // TODO(rmoutard) : maybe put all the oUrl.
    lVisitItems[i]._sPathname = oUrl.pathname;
    lVisitItems[i]._sHostname = oUrl.hostname;
    if (oUrl.pathname === "/search") {
      // We found a page generated by a search with query keywords
      oUrl.generateKeywords();

      lVisitItems[i]._sClosestGeneratedPage = lVisitItems[i]._sUrl;
      lVisitItems[i]._lQueryKeywords = oUrl.keywords;
      oCurrentSearchPage = lVisitItems[i];
    } else {
      if (Math.abs(oCurrentSearchPage._iVisitTime - lVisitItems[i]._iVisitTime) <= iSliceTime) {

        lVisitItems[i]._sClosestGeneratedPage = oCurrentSearchPage._sUrl;
        lVisitItems[i]._lQueryKeywords = oCurrentSearchPage._lQueryKeywords;
      } else {

        lVisitItems[i]._sClosestGeneratedPage = sNonFound;
        lVisitItems[i]._lQueryKeywords = new Array();
      }
    }
  }

  return lVisitItems;
};

Cotton.Algo.PreTreatment.computeExtractedWordsFromTitle = function(lVisitItems) {
  // Instead of computing every time you compute a distance

  for ( var i = 0, oHistoryItem; oHistoryItem = lVisitItems[i]; i++) {
    oHistoryItem.extractedWords = Cotton.Algo
        .extractWords(oHistoryItem._sTitle);
  }
  return lVisitItems;
};

Cotton.Algo.PreTreatment.suite = function(lVisitItems) {
  lVisitItems = Cotton.Algo.PreTreatment.removeTools(lVisitItems);
  lVisitItems = Cotton.Algo.PreTreatment
      .computeClosestGeneratedPage(lVisitItems);
  lVisitItems = Cotton.Algo.PreTreatment
      .computeExtractedWordsFromTitle(lVisitItems);
  return lVisitItems;
};
