'use strict';

module.exports = function( grunt ) {
    // load grunt tasks dynamicallay
    require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

    // Project configuration.
    grunt.initConfig( {
        // Metadata.
        pkg: grunt.file.readJSON( 'package.json' ),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },

            dist: {
                src: ['lib/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },

            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },

        qunit: {
            files: ['test/**/*.html']
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },

            lib: {
                options: {
                    jshintrc: 'lib/.jshintrc'
                },

                src: ['lib/**/*.js']
            }
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },

            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib', 'qunit']
            },

            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test']
            }
        }
    } );

    // Default task.
    grunt.registerTask( 'default', ['jshint', 'qunit', 'concat', 'uglify'] );
};