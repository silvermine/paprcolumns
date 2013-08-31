function FixedColumnCountColumnizer($elem, settings) {

   PaprColumnizer.call(this, $elem, settings);

}


FixedColumnCountColumnizer.validateSettings = function(settings) {
   forcePositiveInt(settings, 'columns');
   forcePositiveInt(settings, 'maxIterations');
   forcePositiveInt(settings, 'targetHeightMaxOver');
   forceFloatBetweenZeroAndOne(settings, 'targetHeightFuzz');
};


FixedColumnCountColumnizer.prototype = new PaprColumnizer();
FixedColumnCountColumnizer.prototype.constructor = FixedColumnCountColumnizer;


FixedColumnCountColumnizer.prototype.calculateHeight = function() {
   this.$dest.empty();
   for (var i = 0; i < this.settings.columns; i++) {
      this.createColumn(i).appendTo(this.$dest);
   }
   var totalHeight = this.$dest.find('.col').first().append(this.$contents.clone(true)).height();

   var basicHeight = parseInt(totalHeight / this.settings.columns, 10);
   var height = this.padHeight(basicHeight);
   debug('elem height: ' + totalHeight + '; target height now: ' + height);

   // cleanup before returning
   this.$dest.empty();
   return height;
};


FixedColumnCountColumnizer.prototype.padHeight = function(basicHeight) {
   return parseInt(Math.min(
      basicHeight + this.settings.targetHeightMaxOver,
      (basicHeight * (1 + this.settings.targetHeightFuzz))
   ), 10);
};


FixedColumnCountColumnizer.prototype.columnize = function() {
   this.$dest.addClass('columnized').addClass('columns-' + this.settings.columns);
   this.columnizeToTargetHeight(this.calculateHeight(), 1);
};

FixedColumnCountColumnizer.prototype.columnizeToTargetHeight = function(targetHeight, iteration) {
   debug('fixed number columns: ' + this.settings.columns + '; to target height: ' + targetHeight + '; iteration: ' + iteration);

   var $contents = this.$contents.clone(true),
       acceptanceTest = function() {
          return $col.outerHeight(true) <= targetHeight;
       };
   for (var i = 0; i < this.settings.columns; i++) {
      var $col = this.createColumn(i).appendTo(this.$dest);
      $contents = this.splitInto($contents, $col, acceptanceTest);
   }
   if ($contents.size() > 0) {
      debug('contents are left over: ' + $contents.size());
      if (iteration >= this.settings.maxIterations) {
         // This is a fail-safe in case someone has content and configuration that
         // would make us go into an infinite loop trying to determine a height that
         // will work. Rather than do that, we just bloat the last columns and stop.
         this.$dest.find('.col').last().append($contents);
         debug('added all remaining contents to the last column because we are over max iterations');
         return;
      }
      this.$dest.empty();
      return this.columnizeToTargetHeight(this.padHeight(targetHeight), iteration + 1);
   }
};