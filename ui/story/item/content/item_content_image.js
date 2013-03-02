'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Image = Cotton.UI.Story.Item.Content.Element.extend({

  _$img : null,
  _sImageType : null,
  _oItemMenu : null,

  init : function(oItem, sType) {
    self = this;
    this._super(oItem);

    this._sImageType = sType;
    oItem.$().addClass('ct-item-image');
		this._$img = $('<img class="resize">');
		this._oItemMenu = new Cotton.UI.Story.Item.SmallMenu(this);

    if (sType === "img") {
      this._$img.attr("src", this._oItem.visitItem().url());
    }
    if (sType === "imgres") {
	    var oUrl = new UrlParser(this._oItem.visitItem().url());
    	oUrl.fineDecomposition();
        var sImgSrc = oUrl.replaceHexa(oUrl.dSearch['imgurl']);
      this._$img.attr("src", sImgSrc);
    }
    // create the item

		self._$item_content.append(
		  self._$img,
		  self._oItemMenu.$()
		);
		
		this.resize(self._$img);
  },

  resize : function($img) {
	  $img.load(function(){
      var self = $(this);

      //image size and ratio
      var iImWidth = self.width();
      var iImHeight = self.height();
      var fImRatio = iImWidth/iImHeight;

      //div size and ratio
      var iDivWidth = self.parent().width();
      var iDivHeight = self.parent().height();
      var fDivRatio = iDivWidth/iDivHeight;
      
      //center image according on how it overflows
      //if vertical, keep the upper part more visible
      if (fImRatio > fDivRatio) {
        self.css('height',iDivHeight);
        var iOverflow = self.width()-iDivWidth;
        self.css('left',-iOverflow*0.5);
      } else { 
        self.css('width',iDivWidth);
        var iOverflow = self.height()-iDivHeight;
        self.css('top',-iOverflow*0.25);
      }
      $(this).show();
    });
  }
});
