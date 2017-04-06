require('../lib/swiper-3.3.1.min.js');
var tplStar = require('../tpl/star.string');
var fnUtil = require('../util/fn.util.js');
var waterfallUtil = require('../util/waterfall.util.js');
SPA.defineView('star', {
  html: tplStar,
  styles: {
    background: '#125224 !important'
  },
 plugins: ['delegated', {
    name: 'avalon',
    options: function(vm) {
      vm.livelist = [];
      vm.plainLivelist = [];
      vm.beautylist = [];
      vm.zan = [100, 200];
      vm.showLoading = true;
    }
  }],
  init: {
    homeSwiper: null,
    homehotSwiper: null,
    vm: null
  },
  bindActions: {
    'tap.search': function (e, data) {
      this.hide();
    },
    'switch.home': function(e, data) {
            var $el = $(e.el);
            this.homehotSwiper.slideTo($el.index());
            $el.addClass('active').siblings().removeClass('active');
        }
  },
  bindEvents: {
    'beforeShow': function() {
    	 // 保存视图对象
      var self = this;

      // 在视图里创建vm对象
      self.vm = self.getVM();

      // swiper
      self.homehotSwiper = new Swiper('#home-hot-swiper', {
        loop: false,
        onTransitionStart: function() {
          $('#home-hot-nav li').eq(self.homehotSwiper.activeIndex)
            .addClass('active').siblings().removeClass('active');
        }
      });
    }
  }
});
