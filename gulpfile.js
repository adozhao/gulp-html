var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin'); //压缩 html 
var uglify = require('gulp-uglify'); // 压缩 js 
var babel = require('gulp-babel'); // ES6转ES5
var server = require('gulp-connect'); // 启动服务
var buildPath = 'dist/'; // 构建输出目录
var clean = require('gulp-clean'); // 清除目录
var sass = require('gulp-sass')(require('sass')); // sass编译器
var cleanCSS = require('gulp-clean-css') //清除css

// 清除构建目录
gulp.task('clean', function(done) {
    console.log('正在清除目录...' + buildPath)
    return gulp.src('./dist/views/*').pipe(clean());
})

//压缩html
gulp.task("html",function(done){
    console.log('正在压缩HTML...')
    var options = {
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 移除空格
        collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
        removeAttributeQuotes: true, // 删除属性上的双引号
        removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面JS
        minifyCSS: true // 压缩页面CSS
    };
    return gulp.src('./src/views/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest(buildPath + "views/"))
        .pipe(server.reload());
});

// 编译scss
gulp.task("scss",function(done){
    console.log('正在编译scss...')
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(gulp.dest(buildPath +"css/"))
        .pipe(server.reload());
});

// 压缩js
gulp.task("js",function(done){
    console.log('正在压缩JS...')
    return gulp.src('./src/script/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(buildPath + 'js/'))
        .pipe(server.reload());
});

// 复制文件目录
gulp.task('copy', function() {
    console.log('正在复制文件夹...')
    return gulp.src('./src/assets/**').pipe(gulp.dest(buildPath + 'assets'));
});


// 开启服务
gulp.task('server',function(){
    server.server({
        root: 'dist/',
        port: 8080,
        livereload: true
    })
})

// 监听文件变化
gulp.task('watch', function (done) {
    gulp.watch('./src/views/*.html', gulp.parallel('html'));
    gulp.watch('./src/script/*.js', gulp.parallel('js'));
    gulp.watch('./src/scss/*.scss', gulp.parallel('scss'));
    gulp.watch('./src/assets/**', gulp.parallel('copy'));
});

// 执行任务
gulp.task('default', gulp.series(['clean','html','js', 'scss','copy', gulp.parallel('server', 'watch')], (done) => {
    console.log("Gulp is running...");
    done();
}));
