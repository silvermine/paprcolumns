function PaprColumnizer($elem, settings) {

   this.$elem = $elem;
   this.settings = settings;

}


PaprColumnizer.prototype.onAfterAdd = function() {

   this.prepareForColumnization();

   // columnize is implemented by subclasses
   this.columnize();

   this.afterColumnization();

   var paprcolumns = this;
   $(window).resize(function() {
      paprcolumns.$dest.find('.col').css('height', '');
      paprcolumns.equalizeColumnHeights();
   });

};


PaprColumnizer.prototype.prepareForColumnization = function() {
   // TODO: actual destination needs to be configurable
   this.$dest = $('<div />');
   this.$contents = this.$elem.contents().clone(true);
   this.$elem.empty();
   this.$elem.append(this.$dest);
};


PaprColumnizer.prototype.prepareSplitElement = function($orig, $newEl) {
   $orig.addClass('split');
   $newEl.addClass('split');
   if ($orig.attr('id') !== undefined && $.trim($orig.attr('id')) !== '') {
      var cls = $orig.attr('id') + '-splitID';
      $orig.removeAttr('id').addClass(cls);
      $newEl.removeAttr('id').addClass(cls);
   }
};


PaprColumnizer.prototype.afterColumnization = function() {
   this.$dest.find('.col').last().addClass('lastcol').end().first().addClass('firstcol');

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


PaprColumnizer.prototype.splitInto = function($contents, $dest, acceptanceTest) {
   var paprcolumns = this, lastIndex = 0, $leftover = false;
   $contents.each(function(index, el) {
      var $el = $(el);

      $el.detach().appendTo($dest);
      lastIndex = index;

      if (!acceptanceTest()) {
         // take $el back out of the destination
         $el.detach();

         if ($el.hasClass('dontsplit')) {
            lastIndex--;
            return false;
         }

         var $newDest = $el.clone(true),
             $newContents = $newDest.contents();

         $newDest.empty().appendTo($dest);

         paprcolumns.prepareSplitElement($el, $newDest);

         if ($newContents.length === 1 && $newContents.get(0).nodeType === Node.TEXT_NODE && $.trim($newContents.text()) !== '') {
            // this is a text node to split
            var leftoverText = paprcolumns.splitTextInto($newContents, $newDest, acceptanceTest);
            if (leftoverText === false) {
               // TODO: we need to handle this error situation or else we'll probably have an empty node in the column
               debug('ERROR: we were not able to successfully split text');
               leftoverText = $el.text();
            }
            $leftover = $el.text(leftoverText);
            return false;
         }

         $leftover = $el.empty().append(paprcolumns.splitInto($newContents, $newDest, acceptanceTest));
         return false;
      }
   });

   return $('<div />')
      .append($leftover)
      .append($contents.splice(lastIndex + 1))
      .contents();
};


PaprColumnizer.prototype.splitTextInto = function($textEl, $dest, acceptanceTest) {
   var text = $textEl.text();
   var splitLoc = this.findBestSplitLocation(text, $dest, acceptanceTest);

   if (splitLoc === false) {
      return false;
   }

   $dest.text(text.substr(0, splitLoc));
   return text.substr(splitLoc);
};


PaprColumnizer.prototype.findBestSplitLocation = function(text, $dest, acceptanceTest) {
   var range = { min: 0, max: text.length },
       desiredSplit = Math.floor(text.length / 2),
       best = false;
   for (var i = 0; i < this.settings.maxTextIterations; i++) {

      var wordBreak = this.findWordBreakNear(text, desiredSplit);
      $dest.text(text.substr(0, wordBreak));
      if (acceptanceTest()) {
         best = range.min = wordBreak;
      } else {
         range.max = wordBreak;
      }

      // make our new split halfway between min and max
      desiredSplit = (range.max - Math.floor((range.max - range.min) / 2));
      if ((range.max - range.min) < this.settings.minTextIncrement) {
         break;
      }
   }

   return best;
};


PaprColumnizer.prototype.findWordBreakNear = function(text, desiredSplitLoc) {
   // TODO: this is an extremely naive implementation ... it needs to look backward and
   // forward as well as recognize word break characters and markup (i.e. <wbr />), not
   // just relying on spaces
   return text.indexOf(' ', desiredSplitLoc);
};
