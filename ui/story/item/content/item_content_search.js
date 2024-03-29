'use strict';

/**
 * Search Item content. Contains a search input filed,
 * a title, a small label and small action menu
 */
Cotton.UI.Story.Item.Content.Search = Cotton.UI.Story.Item.Content.Element.extend({

  _$itemInfo : null,
  _$title : null,
  _oItemDate : null,
  _$searchBox : null,
  _$searchInput : null,
  _$searchButton : null,
  _oItemLabel : null,
  _oItemWebsite : null,
  _oItemMenu : null,

  init : function(oItem) {
    self = this;
    this._super(oItem);
    oItem.$().addClass('ct-item-search');

    this._$itemInfo = $('<div class="ct-item_info"></div>'),
    this._$title = $('<h3></h3>');
    this._$searchBox = $('<div class="ct-searchbox"></div>');
    this._$searchInput = $('<input type="text" name="ct-google-search">');
    this._$searchButton = $('<img class="ct-search-button" src="media/images/story/item/search_item/search.png"/>');
    this._oItemDate = new Cotton.UI.Story.Item.Date(this);
    this._oItemLabel = new Cotton.UI.Story.Item.SmallLabel(this);
    this._oItemMenu = new Cotton.UI.Story.Item.SmallMenu(this);

    // Title
    if (this.item().historyItem().title() !== "") {
      var sTitle = this.item().historyItem().title().split(" - ")[0];
      this._$title.text(sTitle);
      this._$searchInput.val(sTitle);
    } else {
      this._$title.text("Search");
    }

    // create the item
    self._$item_content.append(
      self._$itemInfo.append(
        self._$title,
        self._oItemDate.$(),
        self._$searchBox.append(
          self._$searchInput,
          self._$searchButton
        )
      ),
      self._oItemLabel.$(),
      self._oItemMenu.$()
    );

  },

});
