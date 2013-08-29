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

   this.equalizeColumnHeights();
};


PaprColumnizer.prototype.equalizeColumnHeights = function() {
   var $cols = this.$dest.find('.col'),
       max = Math.max.apply(null, $.makeArray($cols.map(function() { return $(this).height(); })));
   $cols.height(max);
   debug('set all columns to max height: ' + max);
};


PaprColumnizer.prototype.createColumn = function(i) {
   return $('<div />').attr('id', 'col-' + i).addClass('col');
};


PaprColumnizer.prototype.splitInto = function($dest, $col, $contents, targetHeight) {
   debug('splitInto(' + $dest.attr('id') + ':' + $dest.attr('class') + ') -- ' + $contents.length);
   $contents.each(function(index, el) {
      var prevHeight = $dest.outerHeight(true),
          $el = $(el);
      $el.detach().appendTo($dest);
      if ($dest.outerHeight(true) >= targetHeight) {
         $el.detach();
         debug('dest height: ' + $dest.outerHeight(true) + ' >= targetHeight: ' + targetHeight + ' (prev h: ' + prevHeight + ')');
         return false;
      }
   });
   return $contents.not($dest.contents());
};
