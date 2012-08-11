'use strict';

Cotton.UI.Homepage.MostVisitedGrid = Class.extend({

  _$MostVisitedGrid : null,

  init : function() {
    var self = this;

    self._$MostVisitedGrid = $('<div class="ct-favorites-grid">');
    chrome.topSites.get(function(lTopSites) {
      for ( var i = 0, oTopSite; (oTopSite = lTopSites[i])
          && (i < Cotton.Config.Parameters['iNbMostVisited']); i++) {
        new Cotton.UI.Homepage.Ticket(self,
            '/media/images/home/tickets/TC.jpg', Math
                .floor(Math.random() * 80 + 10), oTopSite['title'],
            oTopSite['url']);
      }
    });
  },

  $ : function() {
    return this._$MostVisitedGrid;
  },

  // TODO(fwouts): Find a way to avoid having to manipulate DOM elements.
  append : function($ticket) {
    this._$MostVisitedGrid.append($ticket);
  },

  hide : function() {
    this._$MostVisitedGrid.hide();
  },

  show : function() {
    this._$MostVisitedGrid.show();
  }
});
