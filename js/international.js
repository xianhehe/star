;$(function() {
	var myScroll = new IScroll("#index-scroll", {
		vScroll: true,
		click: true
	});
	myScroll.on("scrollStart", function() {
		myScroll.refresh();
	});
	
});