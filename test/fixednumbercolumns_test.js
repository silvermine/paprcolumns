(function($) {
   module('jQuery#FixedColumnCountColumnizer', {
      setup: function() {
      }
   });

   test('settings validation', function() {
      expect(22);

      var mode = $.paprcolumns.modes.FIXED_NUMBER;
      $.paprcolstests.alwaysBecomesPositiveInt(mode, 'columns');
      $.paprcolstests.alwaysBecomesPositiveInt(mode, 'maxIterations');
      $.paprcolstests.alwaysBecomesPositiveInt(mode, 'targetHeightMaxOver');
      $.paprcolstests.alwaysBecomesFloatBetweenZeroAndOne(mode, 'targetHeightFuzz');
   });

}(jQuery));
