function FixedColumnHeightColumnizer($elem, settings) {

   PaprColumnizer.call(this, $elem, settings);

}


FixedColumnHeightColumnizer.validateSettings = function(settings) {
   forcePositiveInt(settings, 'columnHeight');
};


FixedColumnHeightColumnizer.prototype = new PaprColumnizer();
FixedColumnHeightColumnizer.prototype.constructor = FixedColumnHeightColumnizer;


FixedColumnHeightColumnizer.prototype.onWindowResize = function() {
   // no-op
};


FixedColumnHeightColumnizer.prototype.equalizeColumnHeights = function() {
   // we don't want the default behavior because we don't need to compute
   // the max height ... we just use a fixed height
   this.$holder.find('.col').height(this.settings.columnHeight);
};


FixedColumnHeightColumnizer.prototype.afterColumnization = function() {
   var $cols = this.$holder.find('.col'),
       totalWidth = 0;

   this.equalizeColumnHeights();

   $cols.each(function(ind, el) {
      totalWidth += $(el).outerWidth(true);
   });

   this.$holder.width(totalWidth);
};


FixedColumnHeightColumnizer.prototype.columnize = function() {
   this.$dest.addClass('fixedHeightCols');
   debug('fixed height columns: ' + this.settings.columnHeight);
   var $contents = this.$contents.clone(true),
       colHeight = this.settings.columnHeight,
       i = 0,
       acceptanceTest = function() {
          return $col.outerHeight(true) <= colHeight;
       };
   while (true) {
      var $col = this.createColumn(i++).appendTo(this.$holder);
      $contents = this.splitInto($contents, $col, acceptanceTest);
      if ($contents.size() === 0) {
         break;
      }
   }
};
