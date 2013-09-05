function PaprColumnizer($elem, settings) {

   this.$elem = $elem;
   this.settings = settings;

}


PaprColumnizer.prototype.run = function() {
   if (this.$elem.data('PaprColumnizer.COLUMNIZING')) {
      debug('Columnizing is already happening');
      return;
   }
   debug('starting columnization');
   this.$elem.data('PaprColumnizer.COLUMNIZING', true);
   this.prepareForColumnization();

   // columnize is implemented by subclasses
   this.columnize();

   this.addFirstLastColClasses();
   this.afterColumnization();
   this.$elem.data('PaprColumnizer.COLUMNIZING', false);

   this.bindEventHandlers();
   debug('columnization done');
};


PaprColumnizer.prototype.bindEventHandlers = function() {
   if (this.eventHandlersBound) {
      return;
   }
   this.eventHandlersBound = true;
   var paprcolumns = this;

   $(window).resize(function() {
      paprcolumns.onWindowResize();
   });
   $(window).load(function() {
      paprcolumns.$dest.find('img').each(function(ind, img) {
         var $img = $(img), $ci = paprcolumns.$contents.find('img#' + $img.attr('id'));
         $ci.height($img.height()).width($img.width());
      });
      debug('recolumnizing because window has finished loading');
      paprcolumns.run();
   });
};


PaprColumnizer.prototype.addFirstLastColClasses = function() {
   this.$holder.find('.col').last().addClass('lastcol').end().first().addClass('firstcol');
};


PaprColumnizer.prototype.prepareForColumnization = function() {
   if (!this.$contents) {
      this.$contents = this.$elem.contents().clone(true);
      this.$contents.find('img').each(function(ind, img) {
         var $img = $(img);
         $img.addClass('dontsplit');
         if ($.trim($img.attr('id')) === '') {
            // we only want to force an ID on those images that do not already have one
            // so that we do not break users' selectors that may be based on hard-coded
            // or otherwise-assigned IDs
            $img.attr('id', 'img-' + ind);
         }
      });
   }
   this.$elem.empty();
   // TODO: actual destination needs to be configurable
   // destination is where the column holder will go
   this.$dest = this.$elem.addClass('columnized');
   // all columnizers should put their generated content into this.$holder
   this.$holder = $('<div />').addClass('colHolder').appendTo(this.$dest);
};


PaprColumnizer.prototype.prepareSplitElement = function($orig, $newEl) {
   $orig.addClass('split');
   $newEl.addClass('split');
   if ($orig.attr('id') !== undefined && $.trim($orig.attr('id')) !== '') {
      var origID = $orig.attr('id'),
          cls = origID + '-splitID';
      $orig.removeAttr('id').addClass(cls).data('undosplit', function() {
         this.attr('id', origID).removeClass(cls).removeClass('split');
      });
   } else {
      $orig.data('undosplit', function() {
         this.removeClass('split');
      });
   }
};


PaprColumnizer.prototype.onWindowResize = function() {
   this.equalizeColumnHeights();
};


PaprColumnizer.prototype.afterColumnization = function() {
   this.$holder.find('.col').css('height', '');
   this.equalizeColumnHeights();
};


PaprColumnizer.prototype.equalizeColumnHeights = function() {
   var $cols = this.$holder.find('.col'),
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

         if ($el.get(0).nodeType === NODE_TYPES.TEXT) {
            var $textDest = $('<span class="splitTextNode" />').appendTo($dest),
                leftoverText = paprcolumns.splitTextInto($el.text(), $textDest, acceptanceTest);

            if (leftoverText === false) {
               // there was no point at which you could split the text and still meet the acceptance
               // test, so basically we have ended up with an empty splitTextNode.
               $textDest.remove();
               lastIndex--;
               return false;
            }

            $el.text('');
            $leftover = $('<span class="splitTextNode" />').text(leftoverText);
         } else {
            var $newDest = $el.clone(true),
                $newCont = $newDest.contents();

            $newDest.empty().appendTo($dest);

            paprcolumns.prepareSplitElement($el, $newDest);

            $leftover = $el.empty().append(paprcolumns.splitInto($newCont, $newDest, acceptanceTest));
            if (paprcolumns.isEmptyOrEmptyTextNode($newDest.contents())) {
               // we basically split an element and stuck it into the current column but then were not
               // able to put anything into it that was accepted by the acceptance test, so we need to
               // get our empty node back out of the current column since all of its contents are really
               // going to end up in the next column anyway
               $newDest.remove();
               // and we want to undo the changes we made to the original element when we prepared it to
               // be split by calling the undo function that was saved in the node by prepareSplitElement
               $el.data('undosplit').call($el);
            }
            $el.removeData('undosplit');
         }
         return false;
      }
   });

   return $('<div />')
      .append($leftover)
      .append($contents.slice(lastIndex + 1))
      .contents();
};


PaprColumnizer.prototype.splitTextInto = function(text, $dest, acceptanceTest) {
   var splitLoc = this.findBestSplitLocation(text, $dest, acceptanceTest),
       destText = splitLoc === false ? false : text.substr(0, splitLoc);

   if (destText === false || $.trim(destText) === '') {
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


PaprColumnizer.prototype.isEmptyOrEmptyTextNode = function($node) {
   return $node.size() === 0 ||
          ($node.size() === 1 && $node.get(0).nodeType === NODE_TYPES.TEXT && ($.trim($($node.get(0)).text()) === ''));
};
