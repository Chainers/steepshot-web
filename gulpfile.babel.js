import gulp from 'gulp';
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

var bases = {
 app: 'src/',
 dist: 'dist/',
};

const paths = {
  bundle: 'app.js',
  entry: 'src/main.js',
  srcCss: ['src/**/*.scss', 'src/**/*.css'],
  srcImg: 'src/images/*',
  srcLint: ['src/**/*.js', 'test/**/*.js'],
  dist: 'dist',
  images: ['images/**/*.png', 'images/**/*.svg', 'images/**/*.ico', 'images/**/*.jpg'],
  distJs: 'dist/js',
  distImg: 'dist/images',
  distDeploy: './dist/**/*'
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
      baseDir: './'
    }
  });
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
  .pipe(rename({ extname: '.css' }))
  .pipe(sourcemaps.init())
  .pipe(postcss([vars, extend, nested, autoprefixer, cssnano]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.dist))
  .pipe(reload({ stream: true }));
});

gulp.task('htmlReplace', () => {
  gulp.src('index.html')
  .pipe(htmlReplace({ css: 'styles/main.css', js: 'js/app.js' }))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('imagemin', () => {
    gulp.src(paths.images, {cwd: bases.app})
      .pipe(imagemin())
      .pipe(gulp.dest(bases.dist + 'images/'));
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

gulp.task('deploy', () => {
  gulp.src(paths.distDeploy)
    .pipe(ghPages());
});

gulp.task('watch', cb => {
  runSequence('clean', ['browserSync', 'watchTask', 'watchify', 'styles', 'lint', 'imagemin'], cb);
});

gulp.task('build', cb => {
  process.env.NODE_ENV = 'production';
  runSequence('clean', ['browserify', 'styles', 'htmlReplace', 'imagemin'], cb);
});
