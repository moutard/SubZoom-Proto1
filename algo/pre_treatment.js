'use strict';

// PreTreatment Workspace
Cotton.Algo.PreTreatment = {};

Cotton.Algo.PreTreatment.removeTools = function(lHistoryItems) {
  // Remove all the tools as mail.google.com, facebook.com.

  var oToolsContainer = generateTools(); // return a list of Tools
  var lCleanHistoryItems = new Array(); // Store the new list without tools
  
  // TODO(rmoutard) : use _.filter function in underscore library
  while ( lHistoryItems.length > 0 ) {
    var oHistoryItem = lHistoryItems.shift();
    var sHostname = new parseUrl(oHistoryItem.url).hostname;

    // if hostname of the url is a Tool remove it
    if (oToolsContainer.alreadyExist(sHostname) === -1) {
      lCleanHistoryItems.push(oHistoryItem);
    }
  }
  return lCleanHistoryItems;
};

Cotton.Algo.PreTreatment.computeClosestGeneratedPage = function(lHistoryItems) {
  // For all historyItems find the closest page generated by a search with
  // query keywords. Store this keywords on the object.

  var iSliceTime = Cotton.Config.Parameters.iSliceTime;
  // After this time a page is considered as non-linked with a query search page
  var sNonFound = "http://www.google.fr/";
  var oCurrentSearchPage = {
    url : "http://www.google.fr/",
    lastVisitTime : 0
  };

  for ( var i = lHistoryItems.length - 1; i >= 0; i--) {
    // Inverse Loop.
    // this method is working because lHistoryItems is sorted by lastVisitTime

    var oUrl = new parseUrl(lHistoryItems[i].url);
    // TODO(rmoutard) : maybe put all the oUrl.
    lHistoryItems[i].pathname = oUrl.pathname;
    lHistoryItems[i].hostname = oUrl.hostname;
    if (oUrl.pathname === "/search") {
      // We found a page generated by a search with query keywords
      oUrl.generateKeywords();

      lHistoryItems[i].closestGeneratedPage = lHistoryItems[i].url;
      lHistoryItems[i].queryKeywords = oUrl.keywords;
      oCurrentSearchPage = lHistoryItems[i];
          } else {
      if (Math.abs(oCurrentSearchPage.lastVisitTime
          - lHistoryItems[i].lastVisitTime) <= iSliceTime) {

        lHistoryItems[i].closestGeneratedPage = oCurrentSearchPage.url;
        lHistoryItems[i].queryKeywords = oCurrentSearchPage.queryKeywords;
      } else {

        lHistoryItems[i].closestGeneratedPage = sNonFound;
        lHistoryItems[i].queryKeywords = new Array();
      }
    }
  }

  return lHistoryItems;
};

Cotton.Algo.PreTreatment.computeExtractedWordsFromTitle = function(lHistoryItems){
  // Instead of computing every time you compute a distance

  for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++ ){
    oHistoryItem.extractedWords = Cotton.Algo.extractWords(oHistoryItem.title);
  }
  return lHistoryItems;
};

Cotton.Algo.PreTreatment.suite = function(lHistoryItems){
  lHistoryItems = Cotton.Algo.PreTreatment.removeTools(lHistoryItems);
  lHistoryItems = Cotton.Algo.PreTreatment.computeClosestGeneratedPage(lHistoryItems);
  lHistoryItems = Cotton.Algo.PreTreatment.computeExtractedWordsFromTitle(lHistoryItems);
  return lHistoryItems;
};
