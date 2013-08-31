(function($) {
   $.paprcolstests = {
      testCombos: function(combos, mode, settingName) {
         for (var i = 0; i < combos.length; i++) {
            var settings = { mode: mode };
            settings[settingName] = combos[i].val;
            settings = $.paprcolumns(settings);
            strictEqual(settings[settingName], combos[i].expect);
         }
      },

      alwaysBecomesPositiveInt: function(mode, settingName) {
         var combos = [
            { val: 'abc', expect: $.paprcolumns.defaults[settingName] },
            { val: -1,    expect: $.paprcolumns.defaults[settingName] },
            { val: 5,     expect: 5 },
            { val: 4.4,   expect: 4 },
            { val: '4.1', expect: 4 }
         ];
         $.paprcolstests.testCombos(combos, mode, settingName);
      },

      alwaysBecomesFloatBetweenZeroAndOne: function(mode, settingName) {
         var combos = [
            { val: 'abc', expect: $.paprcolumns.defaults[settingName] },
            { val: -1,    expect: $.paprcolumns.defaults[settingName] },
            { val: -0.1,  expect: $.paprcolumns.defaults[settingName] },
            { val: 2  ,   expect: $.paprcolumns.defaults[settingName] },
            { val: 5.3,   expect: $.paprcolumns.defaults[settingName] },
            { val: 0.1,   expect: 0.1 },
            { val: '0.2', expect: 0.2 }
         ];
         $.paprcolstests.testCombos(combos, mode, settingName);
      }
   };
}(jQuery));

