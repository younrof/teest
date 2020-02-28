// Gulp and node
var postcss = require('gulp-postcss');
var gulp = require('gulp');
var u = require('gulp-util');
var log = u.log;
var c = u.colors;
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cssnano = require('cssnano');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var notify = require("gulp-notify");
var styleInject = require("gulp-style-inject");
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();
var imagemin = require('gulp-imagemin');
var html5Lint = require('gulp-html');
var jshint = require('gulp-jshint');
var sassLint = require('gulp-sass-lint');
var browserSync = require('browser-sync').create();
var criticalCss = require('critical');
var psi = require('psi');
var tasks = require('gulp-task-listing');
var ngrok = require('ngrok');
var del = require('del');
var sitemap = require('gulp-sitemap');
var php2html = require("gulp-php2html");


// Lister la liste des tâches existantes
gulp.task('help', tasks);

gulp.task('php2html', function () {
    gulp.src([
        './home.php'
    ])
    .pipe(php2html())
    .pipe(gulp.dest("./_site"));
});


// Générer le sitemap.xml
gulp.task('sitemap', function () {
    gulp.src('_site/**/*.html', {
        read: false
    })
        .pipe(sitemap({
            siteUrl: 'URL/site/'
        }))
        .pipe(gulp.dest('./_site'));
});

gulp.task('psi', function() {
    // Set up a public tunnel so PageSpeed can see the local site.
    return ngrok.connect(4000, function (err_ngrok, url) {
        log(c.cyan('ngrok'), '- serving your site from', c.yellow(url));

        // Run PageSpeed once the tunnel is up.
        psi.output(url, {
            nokey: 'true',
            strategy: 'desktop',
            threshold: 80
        }, function (err_psi, data) {
            // Log any potential errors and return a FAILURE.
            if (err_psi) {
                log(err_psi);
                process.exit(1);
            }

            // Kill the ngrok tunnel and return SUCCESS.
            process.exit(0);
        });
    });
});

// Criticla CSS
gulp.task('criticalCss', function() {
    criticalCss.generate({
        inline: true,
        base: './',
        src: '_site/home.html',
        dest: '_site/chome.html',
        minify: true,
        ignore: ['@font-face', /url\(/,/SIFONN_BASIC/g, 'font', /font/, /font/g, /@font-face/g],
        width: 1300,
        height: 900
    });
});


var versionConfig = {
    'value': '%MDS%',
    'append': {
        'key': 'v',
        'to': ['css', 'js']
    }
};

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('sasslint', function () {
    return gulp.src('_sass/**/*.s+(a|c)ss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

gulp.task('jshint', function () {
    browserSync.notify('<span style="color: grey">Running:</span> CSS task');
    return gulp
        .src('./_site/*.js')
        .pipe(jshint({
            'esversion': 6
        }))
        .pipe(jshint.reporter('default'));
});

gulp.task('html5-lint', function() {
    return gulp.src('_site/index.html')
        .pipe(html5Lint())
        .pipe(gulp.dest('_site'));
});

gulp.task('vNumber', function(){
    return gulp.src([
        './_site/*.html'
    ])
    .pipe($.versionNumber(versionConfig))
        .pipe(gulp.dest('_site'));

});

gulp.task('imagemin', function() {
    gulp.src('_site/_images/*')
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 8,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('_site/_images'));
});



gulp.task('sass', function() {
    return gulp.src('_sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'nested',
            onSuccess: function(css) {
                var dest = css.stats.entry.split('/');
                log(c.green('sass'), 'compiled to', dest[dest.length - 1]);
            },
            onError: function(err, res) {
                log(c.red('Sass failed to compile'));
                log(c.red('> ') + err.file.split('/')[err.file.split('/').length - 1] + ' ' + c.underline('line ' + err.line) + ': ' + err.message);
            }
        }))
        .pipe(prefix("last 2 versions", "> 1%"))
        .pipe(minifyCSS())
        .pipe(gulp.dest('_css'));
});

gulp.task('clean-css', function() {
    return del(['_css/{all,main}*'], function (err) {
        if (err) { log(c.red('clean-css'), err); }
        else {
            log(
                c.green('clean-css'),
                'deleted old stylesheets'
            );
        }
    });
});

gulp.task('copy', function () {
    gulp.src([
        '*_css/**/*',
        '*_images/**/*',
        '*javascript/**/*'
    ])
        .pipe(gulp.dest('_site'));
});

gulp.task('javascript_hp', function () {
    gulp.src([
        '_js/main_hp.js'
    ])
        .pipe(concat('all_home.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('_javascript'))
});


gulp.task('javascript_interne', function () {
    gulp.src([
        '_js/main.js'
    ])
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('_javascript'))
});

gulp.task('inject', function () {
    gulp.src("*.html")
        .pipe(styleInject())
        .pipe(gulp.dest("_site"));
});


// Watch
gulp.task('watch', function () {
    gulp.watch('./sass/*.scss', ['sass']);
    gulp.watch('./js/*.js', ['javascript']);
    gulp.watch("*.html").on('change', browserSync.reload);
});


//  Tâche de dév
gulp.task('dev', ['sass', 'clean-css', 'javascript_interne','javascript_hp', 'browser-sync']);

// Tâche prod
gulp.task('prod', ['copy','html5-lint','sasslint', 'jshint', 'imagemin', 'criticalCss','vNumber']);