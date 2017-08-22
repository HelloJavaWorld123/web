//引入gulp包
var gulp = require('gulp');
//工具插件
//sass->css工具
var sass = require('gulp-sass');
//压缩js工具
var uglify = require('gulp-uglify');
//重命名工具
var rename = require('gulp-rename');
//合并工具
var concat = require('gulp-concat');
//压缩css工具
var minifyCss = require('gulp-minify-css');
//压缩html工具
var minifyHtml = require('gulp-minify-html');
//去除debug语句
var stripDebug = require('gulp-strip-debug');
//添加版本号，去除缓存
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
//自动刷新浏览器
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
//angular压缩专用
var annotate = require('gulp-ng-annotate');
//清除旧文件夹
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

//开发环境使用
//合并控制器
gulp.task('concatJS', function () {
    gulp.src('./app/scripts/controllers/**/*')
    //合并到XX名的.js
        .pipe(concat('controller.js'))
        //重命名加上.min
        //导出去
        .pipe(gulp.dest('./app/scripts/'))
        .pipe(reload({stream: true}));
})
//sass生成css功能
gulp.task('buildSass', function () {
    // 找到sass源文件
    gulp.src('./app/sass/*.scss')
    // 编译sass源文件
    // 输出格式风格：http://www.jianshu.com/p/8ff2ed6968c3
        .pipe(sass({outputStyle: 'expanded'}))
        // 输出到指定目录
        .pipe(gulp.dest('./app/styles'))
        .pipe(reload({stream: true}));
});
//合并css功能
gulp.task('concatCss', function () {
    gulp.src(['./app/styles/*.css', '!./app/styles/main.concat.css'])
        .pipe(concat('main.concat.css'))
        .pipe(gulp.dest('./app/styles/'))
});

//监听到文件修改就自动执行
gulp.task('autoBuild', function () {
    // 监听文件改变，并执行相应的任务
    // 监听sass源码有没有修改，如果有，执行buildSass任务
    gulp.watch('./app/sass/*.scss', ['buildSass']);
    gulp.watch('./app/styles/*.css', ['concatCss']);
    // 监听controller源码有没有修改，如果有，执行合并任务
    gulp.watch('./app/scripts/controllers/**/*', ['concatJS']);
});

gulp.task('dev', ['buildSass', 'concatCss', 'concatJS', 'autoBuild'], function () {
    console.log("当前状态：开发环境，进行监听。");
})


//生产环境

//删除旧文件夹
gulp.task('clean', function () {
    return gulp.src('./app/dist')
        .pipe(clean());
});

//合并压缩css功能
gulp.task('minifyCss', function () {
    return gulp.src('./app/styles/*.css')
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        .pipe(rev())
        .pipe(gulp.dest('./app/dist/style'))
        .pipe(rev.manifest())
        //输出到rev版本号文件夹
        .pipe(gulp.dest('./app/dist/rev/css'));
});

gulp.task('minifyJS', function () {
    return gulp.src(['./app/scripts/**/*.js', '!./app/scripts/controllers/**/*.js', '!./app/scripts/controller.js'])
    //合并到XX名的.js
    //.pipe(concat('main.js'))
    //去除debug语句
        .pipe(annotate())
        .pipe(stripDebug())
        //执行压缩
        .pipe(uglify())
        //导出去
        .pipe(rev())
        .pipe(gulp.dest('./app/dist/script'))
        //添加版本号
        .pipe(rev.manifest())
        .pipe(gulp.dest('./app/dist/rev/jsRev'))
        .pipe(reload({stream: true}));
});

gulp.task('minifyControllsersJS', function () {
    return gulp.src('./app/scripts/controllers/**/*.js')
        .pipe(concat('controller.js'))
        //去除debug语句
        .pipe(annotate())
        .pipe(stripDebug())
        //执行压缩
        .pipe(uglify())
        //导出去
        .pipe(rev())
        .pipe(gulp.dest('./app/dist/script/controllers'))
        //添加版本号
        .pipe(rev.manifest())
        .pipe(gulp.dest('./app/dist/rev/controllerRev'))
        .pipe(reload({stream: true}));
});

// 监听代理服务器 + 监听 scss/html 文件
gulp.task('serve', function () {
    //进行代理初始化
    browserSync.init({
        proxy: "http://localhost:10080/LifeHouseAdminForWeb/"
    });
    gulp.watch('./app/sass/*.scss', ['buildSass']);
    gulp.watch('./app/styles/*.css', ['minifyCss']);
    // 监听controller源码有没有修改，如果有，执行合并任务
    gulp.watch('./app/scripts/controllers/**/*', ['concat']);
});

// 添加版本号
gulp.task('rev', function () {

    return gulp.src(['./app/dist/rev/**/*.json', './html/index.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('.'));
});


//默认启动，执行自动监听修改，并且执行CSS生成和JS生成压缩
gulp.task('default', ['dev']);

gulp.task('build', ['minifyCss', 'minifyJS', 'minifyControllsersJS'], function () {
    console.log("构建完成!");
});

//生产环境
gulp.task('dist',function(){
    runSequence('clean','build','rev');
});
