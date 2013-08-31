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
