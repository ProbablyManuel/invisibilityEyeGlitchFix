const fs = require('fs'),
      gulp = require('gulp'),
      clean = require('gulp-clean'),
      concat = require('gulp-concat'),
      zip = require('gulp-zip'),
      zEditPath = 'C:/Users/user/Documents/Skyrim Tools/zEdit_Alpha_v0.5.3';

gulp.task('clean-dist', function() {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('build-dist', function() {
    gulp.src(['index.js', 'src/*.js'])
        .pipe(concat('index.js'))
        .pipe(gulp.dest('dist'));

    gulp.src('partials/*.html')
        .pipe(gulp.dest('dist/partials'));

    return gulp.src('module.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('uninstall-in-zedit', function() {
    let moduleInfo = JSON.parse(fs.readFileSync('module.json')),
        installationPath = `${zEditPath}/modules/${moduleInfo.id}`;

    return gulp.src(installationPath, {read: false})
        .pipe(clean({force: true}));
});

gulp.task('install-in-zedit', function() {
    let moduleInfo = JSON.parse(fs.readFileSync('module.json')),
        installationPath = `${zEditPath}/modules/${moduleInfo.id}`;

    return gulp.src('dist/**/*')
        .pipe(gulp.dest(installationPath));
});

gulp.task('release', function() {
    let moduleInfo = JSON.parse(fs.readFileSync('module.json')),
        moduleId = moduleInfo.id,
        moduleVersion = moduleInfo.version,
        zipFileName = `${moduleId}-v${moduleVersion}.zip`;

    console.log(`Packaging ${zipFileName}`);

    return gulp.src('dist/**/*', { base: 'dist/'})
        .pipe(zip(zipFileName))
        .pipe(gulp.dest('releases'));
});

gulp.task('build', gulp.series('clean-dist', 'build-dist'));

gulp.task('test', gulp.series('uninstall-in-zedit', 'install-in-zedit'));
