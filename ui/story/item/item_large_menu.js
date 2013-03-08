'use strict';

/**
 * Item Description Contains title and first paragraph
 */
Cotton.UI.Story.Item.LargeMenu = Class
    .extend({

      _oItemContent : null,

      _$itemLargeMenu : null,

      _$remove : null,
      _$openLink : null,
      _$open : null,

      init : function(oItemContent) {
        var self = this;

        // current parent element.
        this._oItemContent = oItemContent;

        // current item
        this._$itemLargeMenu = $('<div class="ct-label-large-menu"></div>');

        // current sub elements
        this._$remove = $('<p>Remove</p>');
        this._$openLink = $('<a href="" target="blank"></a>');
        this._$open = $('<p>Open</p>');

        // set values
        // url
        var sUrl = this._oItemContent.item().visitItem().url();
        self._$openLink.attr('href',sUrl);

        //remove element
        this._$remove.click(function(){
          //TODO(rkorach): use only one db for the whole UI
          self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
              'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
          }, function() {
            self._oDatabase.delete('visitItems', self._oItemContent.item().visitItem().id(),
              function() {
        	    self._oItemContent.item().container().isotope('remove', self._oItemContent.item().$());
            });
          });
        });

        // construct item
        self._$itemLargeMenu.append(
          self._$openLink.append(self._$open),
          self._$remove
        );
      },

      $ : function() {
        return this._$itemLargeMenu;
      },

      appendTo : function(oItemContent) {
        oItemContent.$().append(this._$itemLargeMenu);
      },

    });