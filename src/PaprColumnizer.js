function PaprColumnizer($element, settings) {

   this.$element = $element;
   this.settings = settings;

}

PaprColumnizer.prototype.onAfterAdd = function() {

   // this is where you put your code that actually initializes your component
   // after it is added to the DOM object selected by the jQuery selector.
   // you can access the element that this component was added to (there will
   // only be one element since we initialize a unique component for each element
   // returned by the selector) by using this.$element, which will be a jQuery
   // object for the element.

   var newContents = 'my component ran: ' +
      (this.settings.something !== false ? this.settings.something : 'not overridden');
   this.$element.html(newContents);

};
