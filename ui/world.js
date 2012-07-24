'use strict';

/**
 * World class representing the whole interface.
 * 
 * @constructor
 */
Cotton.UI.World = Class.extend({
  _oStickyBar : null,

  init : function() {
    var self = this;
    self._oStickyBar = new Cotton.UI.StickyBar.Bar();
    Cotton.UI.Homepage.HOMEPAGE = new Cotton.UI.Homepage.Homepage();

    self._oStickyBar.on('ready', function() {

      Cotton.DB.Stories.getXStories(10, function(lStories) {
        // Various initializers, mostly for testing.
        var lStickers = [];
        _.each(lStories, function(oStory) {
          var oSticker = self._oStickyBar.buildSticker(oStory);
          lStickers.push(oSticker);
        });

        _.each(lStickers, function(oSticker) {
          oSticker.display();
        });
      });
    });

    Cotton.UI.Homepage.HOMEPAGE = new Cotton.UI.Homepage.Homepage();
    $('.ct-iconButton_home').click(function() {
      Cotton.UI.Homepage.HOMEPAGE.show();
      self._oStickyBar.open();
    });
  },

  /**
   * @this {World}
   */
  update : function() {
    console.log('world update');
    var self = this;
    Cotton.DB.Stories.getXStories(10, function(lStories) {
      // Various initializers, mostly for testing.
      var lStickers = [];
      _.each(lStories, function(oStory) {
        var oSticker = self._oStickyBar.buildSticker(oStory);
        lStickers.push(oSticker);
      });

      _.each(lStickers, function(oSticker) {
        oSticker.display();
      });
    });
  },
});

// We need an object to communicate via BackBone with the algorithm.
// TODO: Remove this hack.
Cotton.UI.World.COMMUNICATOR = {};
_.extend(Cotton.UI.World.COMMUNICATOR, Backbone.Events);
