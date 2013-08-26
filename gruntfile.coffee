module.exports = (grunt) ->
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    watch:
      scripts:
        files: [
          'src/*.coffee'
        ]
        tasks: ['coffee','uglify']
        options:
          interrupt: true

    uglify:
      target:
        files:
          'dist/fake_express_server.min.js': ['dist/fake_express_server.js']

    coffee:
      compile:
        options:
          join: false
          sourceMap: true
        flatten: true
        src: [
          'src/*.coffee'
        ]
        dest: 'dist/fake_express_server.js'
        ext: '.js'

  grunt.registerTask 'default', [
    'coffee'
    'uglify'
    'watch'
  ]
