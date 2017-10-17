import gulp from 'gulp';
import debug from 'gulp-debug';
import autoprefixer from 'autoprefixer';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import rimraf from 'rimraf';
import notify from 'gulp-notify';
import browserSync, { reload } from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
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
import fs from 'fs';
import concat from 'gulp-concat';
import minifyCSS from 'gulp-minify-css';
import stream from 'event-stream';

import awspublish from 'gulp-awspublish';
import s3_index from 'gulp-s3-index';
import revall from 'gulp-rev-all';

import historyApiFallback from 'connect-history-api-fallback';

var bases = {
 app: 'src/',
 dist: 'dist/',
};


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

const guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
})();

var aws_headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};

const paths = {
  bundle: 'app.js',
  entry: 'src/main.js',
  trash: 'src/libraries/**/*',
  srcCss: ['src/**/*.css'],
  srcImg: 'static/images/**/*',
  srcLint: ['src/**/*.js', 'test/**/*.js'],
  srcFonts: ['static/fonts/**/*'],
  dist: 'dist',
  libs: 'static/libs',
  distJs: 'static/react',
  distImg: 'dist/static/images',
  distFonts: 'dist/static/fonts/',
  react: 'static/react'
};

const customOpts = {
  entries: [paths.entry],
  debug: true,
  cache: {},
  packageCache: {}
};

const opts = Object.assign({}, watchify.args, customOpts);

gulp.task('clean', cb => {
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
      .pipe(source(paths.bundle))
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
  .pipe(source(paths.bundle))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.distJs));
});

gulp.task('styles', () => {
  gulp.src(paths.srcCss)
  .pipe(rename({ extname: `.css` }))
  .pipe(sourcemaps.init())
  .pipe(postcss([vars, extend, nested, autoprefixer, cssnano]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.dist))
  .pipe(reload({ stream: true }));
});

gulp.task('htmlReplace', () => {
  gulp.src('index.html')
  .pipe(htmlReplace({
      'css': `styles/styles.${guid}.min.css`,
      'js': `js/bundle.${guid}.min.js`
  }))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('imagemin', () => {
    gulp.src(paths.srcImg)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.distImg))
    .pipe(browserSync.stream());
});

gulp.task('lint', () => {
  gulp.src(paths.srcLint)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('watchTask', () => {
  gulp.watch(paths.srcCss, ['styles']);
  gulp.watch(paths.srcLint, ['lint']);
  gulp.watch(paths.srcImg, ['imagemin']);
});

gulp.task('watch', cb => {
  runSequence('clean', ['browserSync', 'watchTask', 'watchify', 'fonts', 'styles', 'lint', 'imagemin'], cb);
});

gulp.task('generateGuid', (cb) => {
    fs.writeFile('build_guid.json', JSON.stringify({ buildGuid : guid }), cb);
});

gulp.task('styleBundle', () => {
  gulp.src(paths.srcCss)
    .pipe(rename({ extname: `.css` }))
    .pipe(concat(`styles.${guid}.min.css`))
    .pipe(minifyCSS({
      keepBreaks: false
    }))
    .pipe(gulp.dest(`${bases.dist}/styles`));
});

gulp.task('scriptsBundle', () => {
  let jsLibs = 
                gulp.src(`${paths.libs}/**/*.js`)
                .pipe(concat(`bundle.${guid}.min.js`))
                .pipe(uglify())
                .pipe(gulp.dest(`${bases.dist}/js`));

  let jsReact = 
                browserify(paths.entry, { debug: false })
                .transform(babelify)
                .bundle()
                .pipe(source(`bundle.${guid}.min.js`))
                .pipe(buffer())
                .pipe(uglify())
                .pipe(gulp.dest(`${bases.dist}/js`));

  stream.concat(jsLibs, jsReact);
});


gulp.task('build', cb => {
  process.env.NODE_ENV = 'production';
  runSequence('clean', 'generateGuid', ['scriptsBundle', 'styleBundle', 'fonts', 'htmlReplace', 'imagemin'], cb);
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