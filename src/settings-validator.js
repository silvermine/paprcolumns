function validateSettings(settings) {
   settings.targetHeightFuzz = parseFloat(settings.targetHeightFuzz);
   if (isNaN(settings.targetHeightFuzz) || settings.targetHeightFuzz <= 0.01) {
      settings.targetHeightFuzz = $.paprcolumns.defaults.targetHeightFuzz;
   }

   // the mode is a class that has a static validateSettings method on it
   settings.mode.validateSettings(settings);

   return settings;
}
