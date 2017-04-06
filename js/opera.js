//require('../lib/swiper-3.3.1.min.js');
//var tplopera = require('../tpl/opera.string');
//var fnUtil = require('../util/fn.util.js');
//var waterfallUtil = require('../util/waterfall.util.js');
//SPA.defineView('opera', {
//html: tplopera,
//styles: {
//  background: '#2b2938 !important'
//},
//bindActions: {
//  'tap.search': function (e, data) {
//    this.hide();
//  }
//},
// plugins: ['delegated', {
//  name: 'avalon',
//  options: function(vm) {
//    vm.livelist = [];
//    vm.plainLivelist = [];
//    vm.beautylist = [];
//    vm.zan = [100, 200];
//    vm.showLoading = true;
//  }
//}]
//});
;$(function(){
	var myScroll=new IScroll("#index-scroll",{vScroll:true,click:true});
  myScroll.on("scrollStart",function(){
	 	myScroll.refresh();
	 });
});
