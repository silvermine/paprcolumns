/*!
 * jQuery paprcolumns v0.1.0
 * Homepage: https://github.com/silvermine/paprcolumns
 *
 * (c) 2013 Jeremy Thomerson
 * Built: 2013-09-04 10:21:23 AM EDT
 * Licensed under the MIT license.
 */

(function($, undefined) {



function debug(msg) {
   if (window.console && window.console.log) {
      window.console.log(msg);
   }
}


function validateSettings(settings) {
   // validate things that are globally shared between all modes
   // these are limited to things that are inherent to the base
   // content splitting functionality
   forcePositiveInt(settings, 'maxTextIterations');
   forcePositiveInt(settings, 'minTextIncrement');

   // the mode is a class that has a static validateSettings method on it
   settings.mode.validateSettings(settings);

   return settings;
}

function forcePositiveInt(settings, fieldName) {
   var userValue = settings[fieldName],
       intVal = parseInt(userValue, 10);
   settings[fieldName] = (isNaN(intVal) || (intVal <= 0)) ?
      $.paprcolumns.defaults[fieldName] :
      intVal;
}

function forceFloatBetweenZeroAndOne(settings, fieldName) {
   var userValue = settings[fieldName],
       fltVal = parseFloat(userValue);
   settings[fieldName] = (isNaN(fltVal) || (fltVal < 0) || (fltVal > 1)) ?
      $.paprcolumns.defaults[fieldName] :
      fltVal;
}


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
      var cls = $orig.attr('id') + '-splitID';
      $orig.removeAttr('id').addClass(cls);
      $newEl.removeAttr('id').addClass(cls);
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
               // TODO: we need to think about what to do about this case...
               debug('ERROR: we were not able to successfully split text');
               leftoverText = $el.text();
            }

            $el.text('');
            $leftover = $('<span class="splitTextNode" />').text(leftoverText);
         } else {
            var $newDest = $el.clone(true),
                $newCont = $newDest.contents();

            $newDest.empty().appendTo($dest);

            paprcolumns.prepareSplitElement($el, $newDest);

            // TODO: if nothing actually gets put into the split element in the first column
            // you end up with an empty element in the column, which can sometimes be several
            // levels deep
            // (i.e. <div class="box split"><p class="split"><span class="splitTextNode"></span></p></div>)
            // if we didn't put anything in, we should take the $newDest out of $dest

            $leftover = $el.empty().append(paprcolumns.splitInto($newCont, $newDest, acceptanceTest));
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
   this.$holder.empty();
   for (var i = 0; i < this.settings.columns; i++) {
      this.createColumn(i).appendTo(this.$holder);
   }
   var totalHeight = this.$holder.find('.col').first().append(this.$contents.clone(true)).height();

   var basicHeight = parseInt(totalHeight / this.settings.columns, 10);
   var height = this.padHeight(basicHeight);
   debug('elem height: ' + totalHeight + '; target height now: ' + height);

   // cleanup before returning
   this.$holder.empty();
   return height;
};


FixedColumnCountColumnizer.prototype.padHeight = function(basicHeight) {
   return parseInt(Math.min(
      basicHeight + this.settings.targetHeightMaxOver,
      (basicHeight * (1 + this.settings.targetHeightFuzz))
   ), 10);
};


FixedColumnCountColumnizer.prototype.columnize = function() {
   this.$dest.addClass('fixedNumCols').addClass('columns-' + this.settings.columns);
   this.columnizeToTargetHeight(this.calculateHeight(), 1);
};

FixedColumnCountColumnizer.prototype.columnizeToTargetHeight = function(targetHeight, iteration) {
   debug('fixed number columns: ' + this.settings.columns + '; to target height: ' + targetHeight + '; iteration: ' + iteration);

   var $contents = this.$contents.clone(true),
       acceptanceTest = function() {
          return $col.outerHeight(true) <= targetHeight;
       };
   for (var i = 0; i < this.settings.columns; i++) {
      var $col = this.createColumn(i).appendTo(this.$holder);
      $contents = this.splitInto($contents, $col, acceptanceTest);
   }
   if ($contents.size() > 0) {
      debug('contents are left over: ' + $contents.size());
      if (iteration >= this.settings.maxIterations) {
         // This is a fail-safe in case someone has content and configuration that
         // would make us go into an infinite loop trying to determine a height that
         // will work. Rather than do that, we just bloat the last columns and stop.
         this.$holder.find('.col').last().append($contents);
         debug('added all remaining contents to the last column because we are over max iterations');
         return;
      }
      this.$holder.empty();
      return this.columnizeToTargetHeight(this.padHeight(targetHeight), iteration + 1);
   }
};


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


$.fn.paprcolumns = function(options) {

   this.each(function() {
      var $this = $(this);
      debug('paprcolumns on: ' + $this.prop('tagName'));

      // we create a new settings object for each component instance
      // because components can modify the settings as they need to
      // in order to deal with input variants
      var settings = $.paprcolumns(options);
      var component = new settings.mode($this, settings);
      $this.data('paprcolumns', component);
      component.run();
   });

   return this;

};

$.paprcolumns = function(options) {

   // true is for deep copy, {} is so our defaults are not overridden
   var settings = $.extend(true, {}, $.paprcolumns.defaults, options);
   settings = validateSettings(settings);
   return settings;

};


// These constants need to be used by external users, so we make them
// globally accessible by adding them to the jQuery paprcolumns static
// object.

$.paprcolumns.modes = {
   FIXED_NUMBER: FixedColumnCountColumnizer,
   FIXED_HEIGHT: FixedColumnHeightColumnizer
};

$.paprcolumns.defaults = {

   // used by all columnizers:
   mode: $.paprcolumns.modes.FIXED_NUMBER,

   maxTextIterations: 20,

   minTextIncrement: 10,

   // used by FixedColumnCountColumnizer:
   columns: 2,

   maxIterations: 20,

   targetHeightMaxOver: 50,

   targetHeightFuzz: 0.1,

   // used by FixedColumnHeightColumnizer:
   columnHeight: 500

};

// These constants are used only within our codebase, so we do not make
// them global. They will be accessible only within the SIFE that wraps
// all of our code (see intro/outro).

var NODE_TYPES = {
   ELEMENT: 1,
   ATTRIBUTE: 2,
   TEXT: 3,
   CDATA_SECTION: 4,
   ENTITY_REFERENCE: 5,
   ENTITY: 6,
   PROCESSING_INSTRUCTION: 7,
   COMMENT: 8,
   DOCUMENT: 9,
   DOCUMENT_TYPE: 10,
   DOCUMENT_FRAGMENT: 11,
   NOTATION: 12
};



})(jQuery);