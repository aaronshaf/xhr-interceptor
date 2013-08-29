module.exports = (grunt) ->
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    watch:
      scripts:
        files: ['src/*.coffee']
        tasks: ['coffee:compile','uglify']
        options:
          interrupt: true
      tests:
        files: ['tests/*.coffee']
        tasks: ['coffee:tests']
        options:
          interrupt: true

    uglify:
      target:
        files:
          'dist/fake_express_server.min.js': ['dist/fake_express_server.js']

    coffee:
      compile:
        options:
          sourceMap: true
        flatten: true
        src: [
          'src/*.coffee'
        ]
        dest: 'dist/fake_express_server.js'
        ext: '.js'
      tests:
        options:
          join: true
          sourceMap: true
        flatten: true
        src: [
          'tests/*.coffee'
        ]
        dest: 'tests/main.js'

  grunt.registerTask 'default', [
    'coffee'
    'uglify'
    'watch'
  ]
