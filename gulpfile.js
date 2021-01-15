const fs = require('fs');
const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const ejs = require('gulp-ejs');
const data = require('gulp-data');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sassVariables = require('gulp-sass-variables');
const browserSync = require('browser-sync').create();
const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { getBabelInputPlugin } = require('@rollup/plugin-babel');

const src = {
  root: './src/',
  htmlRoot: /src[\/\\]html/,
  ejs: ['src/html/**/*.ejs', '!src/html/**/_*.ejs'],
  js: 'src/js/',
  data: 'src/site_data/',
};

const dest = {
  root: './public/',
  css: './public/assets/css/',
  html: './public/',
  js: './public/js/'
};

function server() {
  browserSync.init({
    server: {
      baseDir: './public/'
    }
  });
};

function html () {
  return gulp
    .src(src.ejs)
    .pipe(
      data(file => {
        const absolutePath = `${file.path
          .split(src.htmlRoot)
          [file.path.split(src.htmlRoot).length - 1].replace('.ejs', '.html')
          .replace(/index\.html$/, '')}`;
        const relativePath = '../'.repeat([absolutePath.split(/\/|\\/g).length - 2]);
        return {
          absolutePath,
          relativePath,
        };
      }),
    )
    .pipe(
      ejs({
        // site: JSON.parse(fs.readFileSync(`${src.data}site.json`)),
      }),
    )
    .pipe(rename(function(path) {
      path.extname = '.html';
    }))
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(gulp.dest(dest.html))
    .pipe(browserSync.reload({stream: true}));
}

function css () {
  // const data = JSON.parse(fs.readFileSync(`${src.data}site.json`));
  // const imgRoot = data.imgRoot ? data.imgRoot : '';
  // const cssRoot = data.cssRoot ? data.cssRoot : '';
  return gulp.src( ["src/sass/**/*.scss", '!' + "src/css/**/_*.scss"] )
    .pipe(sassVariables({ 
      // $imgRoot: imgRoot, $cssRoot: cssRoot 
    }))
    .pipe( sass({
        outputStyle: 'expanded',
      }).on( 'error', sass.logError ) )
    .pipe(autoprefixer())
    .pipe( gulp.dest( dest.css ))
    .pipe(browserSync.reload({stream: true}));
}

function js () {
  return rollup.rollup({
    input: [`${src.js}index.js`],
    plugins: [
      nodeResolve(),
      getBabelInputPlugin({ babelHelpers: 'bundled' })
    ]
  }).then(bundle => {
    return bundle.write({
      file: `${dest.js}main.js`,
      format: 'umd',
      name: 'library',
      sourcemap: true
    });
  });
};

function watchCss () {
  gulp.watch( "src/sass/**/*.scss", css ); 
}

function watchHtml () {
  gulp.watch( "src/html/**/*.ejs", html ); 
}

function watchJs () {
  gulp.watch( "src/js/**/*.js", js ); 
}


gulp.task( 
  "default", 
  gulp.parallel(
    server, 
    watchCss, 
    watchHtml, 
    watchJs,
  )
);

gulp.task(
  "build",
  gulp.parallel(
    css, 
    html, 
    js,
  )
)

exports.watchCss = watchCss;
exports.watchHtml = watchHtml;
exports.watchJs = watchJs;
exports.js = js;
exports.html = html;
exports.css = css;
exports.server = server;