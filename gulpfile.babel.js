'use strict';
import gulp from 'gulp';
import debug from 'gulp-debug';
import autoprefixer from 'autoprefixer';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import babelify from 'babelify';
import uglify from 'gulp-uglifyjs';
import rimraf from 'rimraf';
import notify from 'gulp-notify';
import browserSync, { reload } from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import nested from 'postcss-nested';
import vars from 'postcss-simple-vars';
import extend from 'postcss-simple-extend';
import cssnano from 'cssnano';
import htmlReplace from 'gulp-html-replace';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import runSequence from 'run-sequence';
import ghPages from 'gulp-gh-pages';
import livereload from 'gulp-livereload';
import webserver from 'gulp-webserver';
import plumber from 'gulp-plumber';
import copy from 'gulp-copy';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import pump from 'pump';
import babel from 'gulp-babel';
import webpack from 'gulp-webpack';
import gutil from 'gulp-util';
import notifier from 'node-notifier';
import named from 'vinyl-named';

import awspublish from 'gulp-awspublish';
import s3_index from 'gulp-s3-index';
import revall from 'gulp-rev-all';

import historyApiFallback from 'connect-history-api-fallback';

var bases = {
 app: 'src/',
 dist: 'dist/',
};

var guid = '';

var AWSConfig = {
  "key":    process.env.AWS_ACCESS_KEY_ID,
  "secret": process.env.AWS_SECRET_ACCESS_KEY,
  "bucket": "steepshot-pics-1",
  "region": "us-west-2"
}
var publisher = awspublish.create({
  region: AWSConfig.region,
  params: {
    Bucket: AWSConfig.bucket,
    Key: AWSConfig.key,
    Secret: AWSConfig.secret,
  }
});

var aws_headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};

const paths = {
  entry: 'src/main.js',
  trash: 'src/libraries/**/*',
  srcCss: ['src/**/*.scss', 'src/**/*.css'],
  srcImg: 'static/images/**/*',
  srcLint: ['src/**/*.js', 'test/**/*.js'],
  srcFonts: ['static/fonts/**/*'],
  dist: 'dist',
  distJs: 'dist/js',
  distImg: 'dist/static/images',
  distFonts: 'dist/static/fonts/',
  prepare: 'dist/prepare'
};

const customOpts = {
  entries: [paths.entry],
  debug: true,
  cache: {},
  packageCache: {}
};

const opts = Object.assign({}, watchify.args, customOpts);

gulp.task('clean', (cb) => {
  rimraf('dist', cb);
});

gulp.task('browserSync', () => {
  browserSync({
    server: {
      baseDir: './',
      middleware: [ historyApiFallback() ],
      index: 'index.html'
    }
  });

  gulp.watch("index.html").on('change', browserSync.reload);
});

gulp.task('check', () => {
  browserSync({
    server: {
      baseDir: './dist/',
      middleware: [ historyApiFallback() ],
      index: 'index.html'
    }
  });
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src(paths.srcFonts)
    .pipe(gulp.dest(paths.distFonts));
});

gulp.task('watchify', () => {
  const bundler = watchify(browserify(opts));

  function rebundle() {
    return bundler.bundle()
      .on('error', notify.onError())
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.distJs))
      .pipe(reload({ stream: true }));
  }

  bundler.transform(babelify)
  .on('update', rebundle);
  return rebundle();
});

gulp.task('browserify', () => {
  browserify(paths.entry, { debug: true })
  .transform(babelify)
  .bundle()
  .pipe(source(`app${guid}.js`))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.distJs));
});

gulp.task('styles', () => {
  gulp.src(paths.srcCss)
  .pipe(rename({ extname: `${guid}.css` }))
  .pipe(sourcemaps.init())
  .pipe(postcss([vars, extend, nested, autoprefixer, cssnano]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.dist))
  .pipe(reload({ stream: true }));
});

gulp.task('htmlReplace', () => {
  gulp.src('index.html')
  .pipe(htmlReplace({
    css: [`/styles/main${guid}.css`, `/styles/posts${guid}.css`],
    js: [`/js/app${guid}.js`]
   }))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('react', (cb) => {
  return browserify(paths.entry, { debug: false })
  .transform(babelify)
  .bundle()
  .pipe(source(`react.js`))
  .pipe(buffer())
  .pipe(gulp.dest(paths.prepare));
});

gulp.task('imagemin', () => {
    gulp.src(paths.srcImg)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.distImg))
});

gulp.task('lint', () => {
  gulp.src(paths.srcLint)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('scripts', (cb) => {
  runSequence('react', 'bundle', cb);
});

gulp.task('bundle', (cb) => {
  pump([
    gulp.src([
      `${paths.prepare}/react.js`,
      'static/libs/libs/jquery-ui.min.js',
      'static/libs/libs/jquery-ui.touchPunch.min.js',
      'static/libs/libs/jquery.carouFredSel.min.js',
      'static/libs/libs/jquery.magnific-popup.min.js',
      'static/libs/libs/jquery.touchSwipe.min.js',
      'static/libs/libs/modernizr-custom.min.js',
      'static/libs/app.min.js'
    ]),
    debug({title: 'bundle : '}),
    named(),
    webpack({

      output : {
        filename : `app${guid}.js`
      }
    }),
    gulp.dest(`dist/js`)
  ], cb);
});

gulp.task('watchTask', () => {
  gulp.watch(paths.srcCss, ['styles']);
  gulp.watch(paths.srcLint, ['lint']);
  gulp.watch(paths.srcImg, ['imagemin']);
});

gulp.task('watch', cb => {
  runSequence('clean', ['watchTask', 'watchify', 'fonts', 'styles', 'lint', 'imagemin'], 'browserSync', cb);
});

gulp.task('build', cb => {
  guid = (function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  })().toString();

  process.env.NODE_ENV = 'production';
  runSequence('clean', 'scripts', ['fonts', 'styles', 'htmlReplace', 'imagemin'], cb);
});

gulp.task('deploy', () => {
  gulp.src('dist/**/**')
    // .pipe(revall.revision())
    .pipe(awspublish.gzip())
    .pipe(publisher.publish(aws_headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter())
    .pipe(s3_index(AWSConfig))
});