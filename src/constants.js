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
