$.fn.paprcolumns = function(options) {

   this.each(function() {
      var $this = $(this);
      debug('paprcolumns on: ' + $this.prop('tagName'));

      // we create a new settings object for each component instance
      // because components can modify the settings as they need to
      // in order to deal with input variants
      var settings = $.paprcolumns(options);
      var component = new settings.mode($this, settings);
      $this.data('paprcolumns', component);
      component.onAfterAdd();
   });

   return this;

};

$.paprcolumns = function(options) {

   // true is for deep copy, {} is so our defaults are not overridden
   var settings = $.extend(true, {}, $.paprcolumns.defaults, options);
   settings = validateSettings(settings);
   return settings;

};
