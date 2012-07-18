'use strict';

Cotton.Algo.clusterStory = function(lVisitItems, iNbCluster) {
  // Create an Array of stories with lVisitItems
  // lVisitItems should be sorted by fLastvisitTime

  /**
   * Rq:can't put this directly on the worker because the return is serialized.
   */
  var lStories = new Array();
  var oStoryUnderConstruction = new Cotton.Model.Story();

  // initialized
  if (lVisitItems.length === 0 || iNbCluster === 0) {
    return lStories;
  }

  // inferior or equal is needed <= /
  for ( var i = 0; i <= iNbCluster; i++) {
    lStories[i] = new Cotton.Model.Story();
  }

  var bStoryUnderConstruction = true;
  //
  for ( var j = 0; j < lVisitItems.length; j++) {
    if (lVisitItems[j].clusterId !== "UNCLASSIFIED"
        && lVisitItems[j].clusterId !== "NOISE") {
      bStoryUnderConstruction = false;
      lStories[lVisitItems[j].clusterId].addVisitItem(lVisitItems[j]);

      // Set story title.
      if (lVisitItems[j]._lQueryWords.length !== 0) {
        lStories[lVisitItems[j].clusterId]._sTitle = lVisitItems[j]._lQueryWords
            .join(" ");
      }

    } else if (bStoryUnderConstruction) {
      // remove the noise
      oStoryUnderConstruction.addVisitItem(lVisitItems[j]);
    }
  }

  lStories = _.reject(lStories, function(oStory) {
    return oStory.lastVisitTime() === 0;
  });
  // the lStories[iNbcluster] is the story under constructrion
  // remove it
  return {
    'stories' : lStories,
    'storyUnderConstruction' : oStoryUnderConstruction
  };
};
