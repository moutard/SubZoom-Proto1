'use strict';

Cotton.Algo.clusterStory = function(lVisitItems, iNbCluster) {
  // Create an Array of stories with lVisitItems
  // lVisitItems should be sorted by fLastvisitTime
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

Cotton.Algo.storySELECT = function(lStories, bUseRelevance) {
  // Select among all the stories the ones who should be display.
  var iMaxNumberOfStories = Cotton.Config.Parameters.iMaxNumberOfStories;
  if (bUseRelevance) {
    for ( var i = 1; i < lStories.length; i++) {
      lStories[i].computeRelevance();
    }
    lStories.sort(function(oStoryA, oStoryB) {
      // >0 => B lower than A
      // The more relevant at the beginning.
      return oStoryB.relevance() - oStoryA.relevance();
    })

    // return the most relevant stories
    return lStories.slice(0, iMaxNumberOfStories);
  } else {
    var iMaxNumberOfStories = 5;
    var lDisplayStories = new Array();

    // return story under construction
    lDisplayStories.push(lStories[lStories.length - 1]);

    // return the last one
    lDisplayStories.push(_.max(lStories, function(oItem) {
      return oItem.lastVisitTime();
    }));

    lStories.sort(function(oStory1, oStory2) {
      return oStory2.length() - oStory1.length();
    });

    // return the most longuest Stories
    lDisplayStories = lDisplayStories.concat(lStories.slice(0,
        iMaxNumberOfStories));

    return lDisplayStories;
  }

};