function FixedNumberColumnizer($elem, settings) {

   PaprColumnizer.call(this, $elem, settings);

}

FixedNumberColumnizer.validateSettings = function(settings) {
   settings.columns = parseInt(settings.columns, 10);
   if (isNaN(settings.columns) || settings.columns <= 0) {
      debug('invalid columns for FIXED_NUMBER mode: ' + settings.columns + ', using default');
      settings.columns = $.paprcolumns.defaults.columns;
   }
};

FixedNumberColumnizer.prototype = new PaprColumnizer();
FixedNumberColumnizer.prototype.constructor = FixedNumberColumnizer;


FixedNumberColumnizer.prototype.calculateHeight = function() {
   this.$dest.empty();
   for (var i = 0; i < this.settings.columns; i++) {
      this.createColumn(i).appendTo(this.$dest);
   }
   var totalHeight = this.$dest.find('.col').first().append(this.$contents.clone(true)).height();

   var basicHeight = parseInt(totalHeight / this.settings.columns, 10);
   var height = parseInt(Math.min(
      basicHeight + this.settings.targetHeightMaxOver,
      (basicHeight * (1 + this.settings.targetHeightFuzz))
   ), 10);
   debug('elem height: ' + totalHeight + '; target height now: ' + height);

   // cleanup before returning
   this.$dest.empty();
   return height;
};


FixedNumberColumnizer.prototype.columnize = function() {
   debug('fixed number columns: ' + this.settings.columns);
   this.$dest.addClass('columnized').addClass('columns-' + this.settings.columns);

   var targetHeight = this.calculateHeight();
   for (var i = 0; i < this.settings.columns; i++) {
      var $col = this.createColumn(i).appendTo(this.$dest);
      this.splitInto($col, $col, this.$contents, targetHeight);
   }
};
