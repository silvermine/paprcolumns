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

   var defaultText = 'my component ran: not overridden';

   test('is paprcolumns', function() {
      expect(1);
      strictEqual(this.elems.paprcolumns().text(), defaultText + defaultText + defaultText, 'should have changed text');
   });

}(jQuery));
