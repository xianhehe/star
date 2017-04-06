SPA.defineView('transmit', {
  html: tplTransmit,
  plugins: ['delegated'],
  styles: {
    'background': '#eceef0 !important'
  },
  bindActions: {
    'go.myinfo': function () {
      this.hide();
    }
  },
  bindEvents: {
    'beforeShow': function() {
   	 
    }
  }
});
