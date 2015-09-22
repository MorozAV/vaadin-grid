"use strict";
var gulp = require('gulp');
require('require-dir')('./tasks');
var common = require('./tasks/common');
require('web-component-tester').gulp.init(gulp);
var args = require('yargs').argv;

var version = '0.3.0';

gulp.task('default', function() {
  console.log('\n  Use:\n    gulp <clean|gwt[ --gwt-pretty]|test[:validation:sauce]>\n');
});

gulp.task('clean', ['gwt:clean']);

gulp.task('gwt', ['gwt:copy']);

gulp.task('test', ['gwt:validate', 'test:local']);

gulp.task('test:validation', function(done) {
  common.test(
    {
      browserOptions: {
        name: common.localAddress() + ' / ' + new Date(),
        build: 'vaadin-components / validation'
      },
      plugins: {
        sauce: {
          username: args.sauceUsername,
          accessKey: args.sauceAccessKey,
          browsers: [
            'Windows 7/chrome@41',
            'Windows 7/firefox@36',
            'Windows 7/internet explorer@11'
          ]
        },
        'teamcity-reporter': args.teamcity
      },
      root: '.',
      webserver: {
        port: 2000,
        hostname: common.localAddress()
      }
    }, done);
});

gulp.task('test:vaadin', function(done) {
  common.test(
    {
      browserOptions: {
        url: 'http://validation-hub.devnet.vaadin.com:4444/wd/hub'
      },
      activeBrowsers: [
        {
          browserName: "chrome",
          version: "40",
          platform: "VISTA"
        }
      ],
      root: '.',
      webserver: {
        port: 2000,
        hostname: common.localAddress()
      }
    }, done);
});

gulp.task('test:sauce', function(done) {
  common.testSauce(
    [],
    ['Windows 7/chrome@41',
      'Windows 7/firefox@36',
      'Windows 7/internet explorer@11',
      'OS X 10.10/safari@8.0',
      'OS X 10.10/iphone@8.1',
      'Linux/android@5.0'],
    'vaadin-components / ' + version,
     done)
});
