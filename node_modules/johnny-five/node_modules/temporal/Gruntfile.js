"use strict";
module.exports = function(grunt) {
  function readOptionalJSON( filepath ) {
    var data = {};
    try {
      data = grunt.file.readJSON( filepath );
    } catch(e) {}
    return data;
  }

  // Project configuration.
  grunt.initConfig({
    pkg: "<json:package.json>",
    nodeunit: {
      files: ["test/**/*.js"]
    },
    jshint: {
      all: {
        src: ["grunt.js", "lib/**/*.js", "test/**/*.js"],
        options: readOptionalJSON(".jshintrc")
      }
    },
    jsbeautifier: {
      files: ["lib/**/*.js", "eg/**/*.js", "test/**/*.js"],
      options: {
        js: {
          braceStyle: "collapse",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: false,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 0
        }
      }
    },
    watch: {
      src: {
        files: [
          "Gruntfile.js",
          "lib/**/*.js",
          "test/**/*.js"
        ],
        tasks: ["default"],
        options: {
          interrupt: true,
        },
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks("grunt-jsbeautifier");
  // Default task.
  grunt.registerTask( "default", [ "jsbeautifier", "jshint", "nodeunit" ] );


};
