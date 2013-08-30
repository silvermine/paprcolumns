(function($) {
   module('jQuery#FixedColumnCountColumnizer', {
      setup: function() {
      }
   });

   test('settings validation', function() {
      expect(4);

      var settings = $.paprcolumns({ mode: $.paprcolumns.modes.FIXED_NUMBER, columns: 'abc' });
      strictEqual(settings.columns, $.paprcolumns.defaults.columns, 'columns should be a number');

      settings = $.paprcolumns({ mode: $.paprcolumns.modes.FIXED_NUMBER, columns: -1 });
      strictEqual(settings.columns, $.paprcolumns.defaults.columns, 'columns should be a positive number');

      settings = $.paprcolumns({ mode: $.paprcolumns.modes.FIXED_NUMBER, columns: 5 });
      strictEqual(settings.columns, 5, 'columns should be the number we passed in');

      settings = $.paprcolumns({ mode: $.paprcolumns.modes.FIXED_NUMBER, columns: '4' });
      strictEqual(settings.columns, 4, 'columns should be the number we passed in, regardless of passed type');
   });

}(jQuery));
