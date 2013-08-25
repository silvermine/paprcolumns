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
   this.$contents = this.$elem.children().clone(true);
};


PaprColumnizer.prototype.afterColumnization = function() {
   this.$dest.find('.col').last().addClass('lastcol');

   this.$elem.empty();
   this.$elem.append(this.$dest);

   this.equalizeColumnHeights();
};


PaprColumnizer.prototype.equalizeColumnHeights = function() {
   var $cols = this.$dest.find('.col');
   $cols.height($cols.height());
};


PaprColumnizer.prototype.createColumn = function(i) {
   return $('<div />').attr('id', 'col-' + i).addClass('col');
};
