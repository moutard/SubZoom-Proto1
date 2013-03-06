'use strict';

/**
 * Item Website Contains favicon and website url
 */
Cotton.UI.Story.Item.Website = Class
    .extend({

      _oItemContent : null,

      _$itemWebsite : null,
      _$favicon : null,
      _$url : null,

      init : function(oItemContent) {
        var self = this;

        // current parent element.
        this._oItemContent = oItemContent;
				
        this._$itemWebsite = $('<div class="website"></div>'); 
        this._$favicon = $('<img class="favicon">');
        this._$url = $('<div class="url"></div>');
		  	
        // set values
        
        // url
        var sUrl = this._oItemContent.item().visitItem().url();
        // Extracts www.google.fr from http://www.google.fr/abc/def?q=deiubfds.
        var oReg = new RegExp("\/\/([^/]*)\/");
        var sDomain = sUrl.match(oReg)[1];
        this._$url.text(sDomain);
        
        //favicon
        var wikiReg = new RegExp("wikipedia", "g");
        var googleReg = new RegExp("google", "g");
        if (wikiReg.exec(sDomain)){
          this._$favicon = $('<img class="favicon" src="chrome://favicon/http://www.wikipedia.org/">');
        } else if (googleReg.exec(sDomain)) {
          this._$favicon = $('<img class="favicon" src="chrome://favicon/https://www.google.com/">');          
        } else {
          this._$favicon = $('<img class="favicon" src="chrome://favicon/http://'+sDomain+'/">');
        }
		
        // construct item
        self._$itemWebsite.append(
          self._$favicon,
          self._$url
        );

      },

      $ : function() {
        return this._$itemWebsite;
      },

      appendTo : function($parent) {
        $parent.append(this._$itemWebsite);
      },

    });
