'use strict';

module.exports = function(grunt) {

   var _ = require('underscore'),
       packageConfig = grunt.file.readJSON('package.json'),
       pluginConfig = grunt.file.readJSON('paprcolumns.jquery.json'),
       lumbarConfig = grunt.file.readJSON('lumbar.json');

   // Project configuration.
   var config = {
      meta: _.extend({}, packageConfig, pluginConfig),
      concat: {},
      jshint: {},
      uglify: {},
      copy: {},
      compress: {},
      clean: {}
   };

   config.clean.files = ['dist'];

   config.concat.options = {
      separator: '\n\n',
      stripBanners: true
   };

   config.concat.dist = {
      src: lumbarConfig.modules.paprcolumns.scripts,
      dest: 'dist/<%= meta.name %>.js'
   };

   // we replace variables in place
   config.concat.moduleVariables = {
      options: {
         process: true
      },
      expand: true,
      cwd: 'dist/',
      src: ['*.js', '*.css', 'jquery*' ],
      dest: 'dist'
   };


   config.jshint.gruntfile = {
      options: {
         jshintrc: '.jshintrc'
      },
      src: ['Gruntfile.js']
   };

   config.jshint.dist = {
      options: {
         jshintrc: 'src/.jshintrc'
      },
      src: [config.concat.dist.dest]
   };

   config.jshint.test = {
      options: {
         jshintrc: 'test/.jshintrc'
      },
      src: ['test/**/*.js']
   };

   config.uglify = {
      dist: {
         src: '<%= concat.dist.dest %>',
         dest: 'dist/<%= meta.name %>.min.js'
      }
   };

   config.qunit = {
      files: [ 'test/**/*.html' ]
   };

   grunt.initConfig(config);

   // These plugins provide necessary tasks.
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-qunit');
   grunt.loadNpmTasks('grunt-contrib-jshint');

   var allTasks = [
      'clean',
      'jshint:gruntfile',
      'jshint:test',
      'concat:dist',
      'concat:moduleVariables',
      'jshint:dist',
      'qunit',
      'uglify'
   ];

   // Default task.
   grunt.registerTask('default', allTasks);

   grunt.registerTask('notest', _.without(_.extend([], allTasks), 'qunit'));

};
