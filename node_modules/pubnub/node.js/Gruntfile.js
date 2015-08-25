module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    require: 'tests/tests-include.js',
                    quiet: false
                },
                // NOTICE: ignore test2.js test due it's
                src: ['tests/ssl_test.js', 'tests/test.js']
            },
            unit: 'karma.conf.js'
        },
        nodeunit: {
            tests: ['tests/unit-test.js'],
            options: {}
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ["test:mocha", "test:unit"]);
    grunt.registerTask('test:mocha', 'mochaTest');
    grunt.registerTask('test:unit', 'nodeunit');
};