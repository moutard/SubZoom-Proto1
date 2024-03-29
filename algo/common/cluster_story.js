'use strict';

/**
 * Given an array of historyItems labeled with a "clusterId", return a list of
 * stories, that contains all historyItems with the same label.
 *
 * @param {Array.
 *          <Object>} lHistoryItems : array of DbRecordHistoryItem (because they
 *          have been serialized by the worker.)
 * @param {int}
 *          iNbCluster
 * @returns {Object} dStories list of all the stories.
 *
 *
 */
Cotton.Algo.clusterStory = function(lHistoryItems, iNbCluster) {
  DEBUG && console.debug("cluster story")
  DEBUG && console.debug(lHistoryItems);
  DEBUG && console.debug(iNbCluster);
  var lStories = [];
  // TODO(rmoutard) : storyUnderConstruction is usless now.
  var oStoryUnderConstruction = new Cotton.Model.Story();

  // There is nothing to cluster.
  if (lHistoryItems.length === 0 || iNbCluster === 0) {
    return {
      'stories' : lStories,
      'storyUnderConstruction' : oStoryUnderConstruction
    };
  }

  // initialized
  for ( var i = 0; i < iNbCluster; i++) {
    lStories[i] = new Cotton.Model.Story();
  }

  var bStoryUnderConstruction = true;

  for ( var j = 0, iLength = lHistoryItems.length; j < iLength; j++) {
    if (lHistoryItems[j]['clusterId'] !== "UNCLASSIFIED"
        && lHistoryItems[j]['clusterId'] !== "NOISE") {

      //
      bStoryUnderConstruction = false;

      // Add the historyItem in the corresponding story.
      lStories[lHistoryItems[j]['clusterId']]
          .addDbRecordHistoryItem(lHistoryItems[j]);
      // If the historyItem was already in a story change the story Id. So when
      // you will put the story, it will be modified.
      if (lHistoryItems[j]['sStoryId'] !== "UNCLASSIFIED") {
        lStories[lHistoryItems[j]['clusterId']].setId(lHistoryItems[j]['sStoryId']);
      }

      // Set story title.
      if (lStories[lHistoryItems[j]['clusterId']].title() === ""
          || lStories[lHistoryItems[j]['clusterId']]['temptitle'] === true) {
        // first condition indicates that title is not defined
        // second condition indicates we can find a better title
        // in both case we recompute the title.
        if (lHistoryItems[j]['oExtractedDNA']['lQueryWords'].length !== 0) {
          lStories[lHistoryItems[j]['clusterId']]
              .setTitle(lHistoryItems[j]['oExtractedDNA']['lQueryWords'].join(" "));
          lStories[lHistoryItems[j]['clusterId']]['temptitle'] = false;
        } else if (lHistoryItems[j]['sTitle'] !== "") {
          lStories[lHistoryItems[j]['clusterId']]
              .setTitle(lHistoryItems[j]['sTitle']);
          lStories[lHistoryItems[j]['clusterId']]['temptitle'] = true;
        }
      }

      // Set Featured image
      if (lStories[lHistoryItems[j]['clusterId']].featuredImage() === ""
          || lStories[lHistoryItems[j]['clusterId']]['tempimage'] === true) {
        // first condition indicates that imageFeatured is not defined
        // second condition indicates we can find a better image
        // in both case we recompute the title.
        var reg = new RegExp(".(jpg|png|gif)$", "g");
        var oUrl = new UrlParser(lHistoryItems[j]['sUrl']);
        oUrl.fineDecomposition();
        if (reg.exec(lHistoryItems[j]['sUrl'])) {
        	//Image
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage(lHistoryItems[j]['sUrl']);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.pathname === "/imgres") {
          //Image from google image search
    	  oUrl.fineDecomposition();
		  var sSearchImgUrl = oUrl.replaceHexa(oUrl.dSearch['imgurl']);
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage(sSearchImgUrl);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.hostname === "www.youtube.com" && oUrl.dSearch['v']) {
        	//Youtube video
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage("http://img.youtube.com/vi/" + oUrl.dSearch['v'] + "/mqdefault.jpg");
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.hostname === "vimeo.com" && oUrl.pathname.match(/(\/[0-9]+)$/)) {
        	//Vimeo video
          var thumbnail_src;
          $.ajax({
              url: 'http://vimeo.com/api/v2/video/' + sLastStringFromPathname + '.json',
              dataType: 'json',
              async: false,
              success: function(data) {
              thumbnail_src = data[0].thumbnail_large;
            }
          });
          lStories[lHistoryItems[j]['clusterId']].setFeaturedImage(thumbnail_src);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.hostname === "www.dailymotion.com" && oUrl.pathname.split('/')[1] == "video") {
        	//Dailymotion video (from video page)
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage("http://" + oUrl.hostname + "/thumbnail" + oUrl.pathname);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.hostname === "www.dailymotion.com" && oUrl.dHash['video']) {
        	//Dailymotionvideo (from channel page)
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage("http://" + oUrl.hostname + "/thumbnail/video/" + dHash['video']);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.hostname.match(/^(maps\.google\.)/) && oUrl.pathname == "/maps") {
        	//Google maps
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage("http://maps.googleapis.com/maps/api/staticmap?center=" + oUrl.dSearch['q'] +
              "&sensor=false&size=200x120&maptype=roadmap&markers=color:blue%7C" + oUrl.dSearch['q']);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (lHistoryItems[j]['oExtractedDNA']['sImageUrl'] !== "") {
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage(lHistoryItems[j]['oExtractedDNA']['sImageUrl']);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = true;
        }
      }

    } else if (bStoryUnderConstruction) {
      oStoryUnderConstruction.addDbRecordHistoryItem(lHistoryItems[j]);
    }
  }

  lStories = _.reject(lStories, function(oStory) {
    return oStory.lastVisitTime() === 0;
  });

  return {
    'stories' : lStories,
    'storyUnderConstruction' : oStoryUnderConstruction
  };
};
