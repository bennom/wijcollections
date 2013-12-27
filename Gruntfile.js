'use strict';

module.exports = function( grunt ) {
    var banner = '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n';

    // load grunt tasks dynamicallay
    require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

    // Project configuration.
    grunt.initConfig( {
        // Metadata.
        pkg: grunt.file.readJSON( 'package.json' ),
        banner: banner,

        usebanner: {
            bannerTop: {
                options: {
                    position: 'top',
                    banner: banner
                },
                files: {
                    src: ['dist/modules/**/*.js']
                }
            }
        },

        bower: {
            install: {
                options: {
                    targetDir: 'third_party',
                    install: true,
                    verbose: true,
                    cleanTragetDir: true,
                    cleanBowerDir: true
                }
            }
        },

        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },

            dist: {
                src: ['lib/modules/<%= pkg.name %>.js'],
                dest: 'dist/modules/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },

            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            },

            notRequired: {
                src: 'not-required/<%= pkg.name %>.js',
                dest: 'not-required/<%= pkg.name %>-<%= pkg.version %>.min.js',
            }
        },

        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.name %> <%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'lib/',
                    outdir: 'documentation/api/',
                    themedir: 'documentation/themes/wiFlat'
                }
            }
        },

        clean: {
            rjsOutput: ['dist'],
            notRequired: ['not-required/*.min.js']
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'lib/',
                    dir: 'dist/modules/../',
                    optimize: 'uglify2',
                    preserveLicenseComments: false
                }
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
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib', 'qunit']
            },
            yuidoc: {
                files: 'documentation/themes/**/*.*',
                tasks: ['yuidoc']
            }
        }
    } );

    // Default task.
    grunt.registerTask( 'default', [
        'jshint',
        'qunit',
        'clean:rjsOutput',
        'requirejs',
        'usebanner:bannerTop',
        'yuidoc',
        'clean:notRequired',
        'uglify:notRequired'
    ] );

    // Travis CI
    grunt.registerTask( 'travis-ci', ['jshint', 'qunit'] );
};
