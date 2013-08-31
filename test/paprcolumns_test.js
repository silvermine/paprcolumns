(function($) {
   /*
      ======== A Handy Little QUnit Reference ========
      http://api.qunitjs.com/

      Test methods:
         module(name, {[setup][ ,teardown]})
         test(name, callback)
         expect(numberOfAssertions)
         stop(increment)
         start(decrement)
      Test assertions:
         ok(value, [message])
         equal(actual, expected, [message])
         notEqual(actual, expected, [message])
         deepEqual(actual, expected, [message])
         notDeepEqual(actual, expected, [message])
         strictEqual(actual, expected, [message])
         notStrictEqual(actual, expected, [message])
         throws(block, [expected], [message])
   */

   module('jQuery#paprcolumns', {
      // This will run before each test in this module.
      setup: function() {
         this.elems = $('#qunit-fixture').children();
      }
   });

   test('is chainable', function() {
      expect(1);
      // Not a bad test to run on collection methods.
      strictEqual(this.elems.paprcolumns(), this.elems, 'should be chainable');
   });

   test('settings validation', function() {
      var modeNames = Object.keys($.paprcolumns.modes);
      expect(10 * modeNames.length);
      for (var i = 0; i < modeNames.length; i++) {
         var mode = $.paprcolumns.modes[modeNames[i]];
         $.paprcolstests.alwaysBecomesPositiveInt(mode, 'maxTextIterations');
         $.paprcolstests.alwaysBecomesPositiveInt(mode, 'minTextIncrement');
      }
   });

}(jQuery));
