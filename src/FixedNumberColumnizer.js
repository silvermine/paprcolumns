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

FixedNumberColumnizer.prototype.columnize = function() {
   debug('fixed number columns: ' + this.settings.columns);
   this.$dest.addClass('columnized').addClass('columns-' + this.settings.columns);

   var childrenPerCol = Math.ceil(this.$elem.children().size() / this.settings.columns);
   for (var i = 0; i < this.settings.columns; i++) {
      var $col = this.createColumn(i).appendTo(this.$dest);
      for (var x = 0; this.$contents.size() > 0 && x < childrenPerCol; x++) {
         var $elem = this.$contents.first();
         this.$contents = this.$contents.not($elem);
         $elem.detach().appendTo($col);
      }
      debug('added ' + $col.children().size() + ' to col ' + i);
   }
};
