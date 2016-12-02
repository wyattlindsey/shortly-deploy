module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/lib/*.js', 'public/client/*.js'],
        dest: 'public/dist/app.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          env: {
            NODE_ENV: 'development'
          }
        }
      }
    },

    uglify: {
      prod: {
        files: {
          'public/dist/app.min.js': 'public/dist/app.js'
        }
      }
    },

    clean: {
      build: ['public/dist/*']
    },

    eslint: {
      options: {
        configFile: '.eslintrc.js'
      },
      target: [
        'public/**/*.js',
        'lib/**/*.js',
        'app/**/*.js',
        'test/**/*.js',
        '*.js'
      ]
    },

    cssmin: {
      prod: {
        files: {
          'public/dist/s.min.css': ['public/*.css'] }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: [
          'git push origin master',
          'git push live master'
        ].join('&&')
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'clean',
    'eslint',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run([
        'test',
        'shell:prodServer'
      ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run([
        'build',
        'server-dev'
      ]);
    } else {
      grunt.task.run([
        'server-dev'
      ]);
    }
  }
  );

};
