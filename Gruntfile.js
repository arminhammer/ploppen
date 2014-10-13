'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({

        myApp: {
            app: require('./bower.json').appPath || 'app',
            dist: 'dist'
        },

        typescript: {
            base: {
                src: ['<%= myApp.app %>/js/{,*/}*.ts'],
                options: {
                    target: 'es5',
                    sourceMap: true
                }
            },
            test: {
                src: ['test/unit/{,*/}*.ts'],
                options: {
                    target: 'es5',
                    sourceMap: true
                }
            }
        },

        watch: {
            ts: {
                files: ['<%= myApp.app %>/js/{,*/}*.ts'],
                tasks: ['typescript']
            },
            tsTest: {
                files: ['test/unit/{,*/}*.ts'],
                tasks: ['typescript:test']
            },
            js: {
                files: ['<%= myApp.app %>/js/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/unit/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= myApp.app %>/css/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= myApp.app %>/{,*/}*.html',
                    '.tmp/css/{,*/}*.css',
                    '<%= myApp.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= myApp.app %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= myApp.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= myApp.dist %>'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= myApp.app %>/js/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['test/unit/{,*/}*.js']
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= myApp.dist %>/*',
                        'nwbuilds/**/*',
                        '!<%= myApp.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/css/',
                    src: '{,*/}*.css',
                    dest: '.tmp/css/'
                }]
            }
        },

        'bower-install': {
            app: {
                html: '<%= myApp.app %>/index.html',
                ignorePath: '<%= myApp.app %>/'
            }
        },

        rev: {
            dist: {
                files: {
                    src: [
                        '<%= myApp.dist %>/js/{,*/}*.js',
                        '<%= myApp.dist %>/css/{,*/}*.css',
                        '<%= myApp.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= myApp.dist %>/css/fonts/*'
                    ]
                }
            }
        },

        useminPrepare: {
            html: '<%= myApp.app %>/index.html',
            options: {
                dest: '<%= myApp.dist %>'
            }
        },

        usemin: {
            html: ['<%= myApp.dist %>/{,*/}*.html'],
            css: ['<%= myApp.dist %>/css/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= myApp.dist %>']
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= myApp.app %>/img',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= myApp.dist %>/img'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= myApp.app %>/img',
                    src: '{,*/}*.svg',
                    dest: '<%= myApp.dist %>/img'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= myApp.dist %>',
                    src: ['*.html', 'partials/{,*/}*.html'],
                    dest: '<%= myApp.dist %>'
                }]
            }
        },

        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/js',
                    src: '*.js',
                    dest: '.tmp/concat/js'
                }]
            }
        },

        cdnify: {
            dist: {
                html: ['<%= myApp.dist %>/*.html']
            }
        },

        nodewebkit: {
            options: {
                platforms: ['win','osx', 'linux64'],
                buildDir: './nwbuilds' // Where the build version of my node-webkit app is saved
            },
            src: ['./dist/**/*', './node_modules/socket.io*/**/*'] // Your node-webkit app
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= myApp.app %>',
                    dest: '<%= myApp.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'partials/{,*/}*.html',
                        'bower_components/**/*',
                        'img/{,*/}*.{webp}',
                        'fonts/*',
                        'package.json'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/img',
                    dest: '<%= myApp.dist %>/img',
                    src: ['generated/*']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= myApp.app %>/css',
                dest: '.tmp/css/',
                src: '{,*/}*.css'
            },
            modules: {
                expand: true,
                cwd: '<%= myApp %>/node_modules',
                dest: '<%= myApp.dist %>/node_modules',
                src: 'socket.io/**/*'
            }
        },

        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },

        replace: {
            development: {
                options: {
                    patterns: [{
                        json: grunt.file.readJSON(
                            'config.development.json')
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['config.js'],
                    dest: '<%= myApp.app %>/js'
                }]
            },
            azure: {
                options: {
                    patterns: [{
                        json: grunt.file.readJSON('config.azure.json')
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['config.js'],
                    dest: '<%= myApp.app %>/js'
                }]
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'bower-install',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'replace:development',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn(
            'The `server` task has been deprecated. Use `grunt serve` to start a server.'
        );
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        'copy:modules',
        'cdnify',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin',
        'nodewebkit'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
