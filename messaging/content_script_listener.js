'use strict';

/**
 * Content Script Listener
 *
 * Instance host by background.html Listen all the messages send by content
 * scripts (i.e. scritps injected directly in the page.
 *
 * See below page for more informations.
 * http://code.google.com/chrome/extensions/messaging.html
 */

/**
 * onRequest : link with the chrome API method
 * chrome.extension.onRequest.addListener
 *
 * Called when a message is passed by a content script.
 */

// Listen for the content script to send a message to the background page.
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

  console.log(request);

  switch (request['action']) {
  case 'create_visit_item':

    /**
     * Because Model are compiled in two different way by google closure
     * compiler we need a common structure to communicate throught messaging.
     * We use dbRecord, and translators give us a simple serialisation process.
     */
    var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
    var oTranslator = lTranslators[lTranslators.length - 1];
    var oVisitItem = oTranslator.dbRecordToObject(
                                                request['params']['visitItem']
                                                  );
    console.debug(oVisitItem.url());
    // Compute the referer id as it should be returned by the Chrome Extension
    // History API. We need this algorithm because in some cases, such as when
    // you open a link in a new tab, the referer id is not filled by Chrome, so
    // we need to fill it ourselves.
    // TODO(fwouts): Move out of here.

//    var mGetVisitsHandler = function(lChromeReferrerVisitItems) {
      // Select the last one the visit items.

      /*if (lChromeReferrerVisitItems && lChromeReferrerVisitItems.length > 0) {
        var iIndex = lChromeReferrerVisitItems.length - 1;
        var oReferrerVisitItem = lChromeReferrerVisitItems[iIndex];
        // Update the visit item accordingly.
        oVisitItem.setChromeReferringVisitId(oReferrerVisitItem.visitId);
      }*/

      // Other processing following this.

      // TODO(rmoutard) : use DB system, or a singleton.
      var oToolsContainer = new Cotton.Utils.ToolsContainer();
      var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

      var sHostname = new parseUrl(oVisitItem.url()).hostname;
      var sPutId = ""; // put return the auto-incremented id in the database.

      // Put the visitItem only if it's not a Tool, and it's not in the exluded
      // urls.
      // TODO (rmoutard) : parseUrl is called twice. avoid that.
      if (!oToolsContainer.isTool(sHostname) && !oExcludeContainer.isExcluded(oVisitItem.url())) {
        var oStore = new Cotton.DB.Store('ct', {
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
        }, function() {

          // you want to create it for the first time.
          oStore.put('visitItems', oVisitItem, function(iId) {
            console.log("visitItem added");
            console.log(iId);
            sPutId = iId;

            // Return nothing to let the connection be cleaned up.
            sendResponse({
              'received' : "true",
              'id' : sPutId,
            });

          });

        });
      } else {
        console
            .debug("Content Script Listener - This visit item is a tool or an exluded url.");
      }
//    };

    /*
    var sReferringUrl = oVisitItem.referrerUrl();
    if (sReferringUrl) {
      chrome.history.getVisits({
        url : sReferringUrl
      }, mGetVisitsHandler);
    } else {
      mGetVisitsHandler([]);
    }
    */

    // to allow sendResponse
    return true;
  case 'update_visit_item':
    return true;
  }

});
