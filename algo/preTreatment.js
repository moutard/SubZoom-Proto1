function removeTools (lHistoryItems) {
  var oToolsContainer = generateTools();
  var lCleanHistoryItems = new Array();

  for(var i = 0; i < lHistoryItems.length; i++) {
    var oHistoryItem = lHistoryItems.pop();
    var sHostname = parseURL(oHistoryItem.url).hostname;
    
    if(oToolsContainer.alreadyExist(sHostname) === -1){
      lCleanHistoryItems.push(oHistoryItem);
    }
  }

  return lCleanHistoryItems;
}
