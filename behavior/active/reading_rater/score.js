'use strict';

/**
 * Score is used to compute the value of pertinence of a given paragraph. See
 * {Cotton.Model.ExtractedParagraph} for the data model link to the database.
 */

Cotton.Behavior.Active.Score = Class
    .extend({

      _iId : undefined,
      _$block : null,
      _fScore : null,

      init : function($block) {
        this._$block = $block;
        this._iId = $block.attr('ct-id');
        this._fScore = 0;
      },

      id : function() {
        return this._iId;
      },

      score : function() {
        return this._fScore;
      },

      text : function() {
        return this._$block.text();
      },

      serialize : function() {
        var self = this;
        var dDBRecord = {
          'id' : self._iId,
          'sText' : self._$block.text(),
          'fScore' : self._fScore
        };

        return dDBRecord;
      },

      increment : function(fIncrement) {
        this._fScore += fIncrement;
        this._fScore = Math.min(1, this._fScore);
        if (Cotton.Config.Parameters.bDevMode === true) {
          // TODO(fwouts): Use a constant.
          var MIN_COLOR = 128;
          var MAX_COLOR = 255;
          var iColorQuantity = MIN_COLOR
              + Math.round(this._fScore * (MAX_COLOR - MIN_COLOR));
          this._$block.css('background', 'rgb(' + iColorQuantity + ', '
              + iColorQuantity + ', ' + iColorQuantity + ')');
          this._$block.css('color', '#000');
        }
      },

      // TODO(fwouts): Move this method out of there.
      visibleSurface : function() {
        // The score will increase proportionnaly to the visible surface of the
        // block
        // (which depends both on the total surface of the block and the current
        // scroll,
        // which could be hiding part of it).
        var iBlockHeight = this._$block.height();
        var iBlockWidth = this._$block.width();

        var iWindowScrollTop = $(window).scrollTop();
        var iWindowVisibleHeight = window.innerHeight;
        var dBlockOffset = this._$block.offset();
        var iBlockOffsetTop = dBlockOffset.top;
        var iBlockOffsetBottom = dBlockOffset.top + iBlockHeight;

        var iBlockHiddenTop = (iWindowScrollTop < iBlockOffsetTop) ? 0
            : (iWindowScrollTop - iBlockOffsetTop);
        var iBlockHiddenBottom = (iWindowScrollTop + iWindowVisibleHeight > iBlockOffsetBottom) ? 0
            : (iBlockOffsetBottom - (iWindowScrollTop + iWindowVisibleHeight));

        var iVisibleHeight = Math.max(0, iBlockHeight - iBlockHiddenTop
            - iBlockHiddenBottom);
        var iVisibleSurface = iVisibleHeight * iBlockWidth;

        return iVisibleSurface;
      },

      totalSurface : function() {
        var iBlockHeight = this._$block.height();
        var iBlockWidth = this._$block.width();
        return iBlockHeight * iBlockWidth;
      },

    });
