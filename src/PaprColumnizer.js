function PaprColumnizer($elem, settings) {

   this.$elem = $elem;
   this.settings = settings;

}


PaprColumnizer.prototype.onAfterAdd = function() {

   this.prepareForColumnization();

   // columnize is implemented by subclasses
   this.columnize();

   this.afterColumnization();

};


PaprColumnizer.prototype.prepareForColumnization = function() {
   // TODO: actual destination needs to be configurable
   this.$dest = $('<div />');
   this.$contents = this.$elem.contents().clone(true);
   this.$elem.empty();
   this.$elem.append(this.$dest);
};


PaprColumnizer.prototype.afterColumnization = function() {
   this.$dest.find('.col').last().addClass('lastcol');

   // TODO correctly this.equalizeColumnHeights();
};


PaprColumnizer.prototype.equalizeColumnHeights = function() {
   // var $cols = this.$dest.find('.col');
   // TODO: get max and set all cols to max: $cols.height($cols.height());
};


PaprColumnizer.prototype.createColumn = function(i) {
   return $('<div />').attr('id', 'col-' + i).addClass('col');
};


PaprColumnizer.prototype.splitInto = function($dest, $col, $contents, targetHeight) {
   debug('splitInto(' + $dest.attr('id') + ':' + $dest.attr('class') + ')');
   for (var i = 0; i < $contents.length; i++) {
      var prevHeight = $dest.outerHeight(true),
          $el = $($contents[i]);
      this.$contents = this.$contents.not($el);
      $el.detach().appendTo($dest);
      if ($dest.height() >= targetHeight) {
         debug('dest height: ' + $dest.outerHeight(true) + ' >= targetHeight: ' + targetHeight + ' (prev h: ' + prevHeight + ')');
         return;
      }
   }
};
