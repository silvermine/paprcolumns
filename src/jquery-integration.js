// this is where your code that is directly related to extending
// jQuery goes. All other code should be abstracted to classes
// outside of this file. This file should not become very large
// because it should basically just instantiate an instance of
// your plugin component, add it to the given element(s) and then
// make sure the component runs on those elements.
$.fn.paprcolumns = function(options) {

   var settings = $.paprcolumns(options);

   this.each(function() {
      var $this = $(this);
      debug('paprcolumns on: ' + $this.prop('tagName'));

      var component = new PaprColumnizer($this, settings);
      $this.data('paprcolumns', component);
      component.onAfterAdd();
   });

   return this;

};

// this is a jQuery static function you could do something with if you needed to
// for right now we are using it just to build a valid set of settings for our
// plugin
$.paprcolumns = function(options) {

   // true for deep copy
   // {} so our defaults are not overridden
   var settings = $.extend(true, {}, $.paprcolumns.defaults, options);
   settings = validateSettings(settings);
   return settings;

};
