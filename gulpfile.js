var gulp = require('gulp');
var rev = require('gulp-rev'),
	revCollector = require('gulp-rev-collector');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var runSequence = require('run-sequence');
var del = require('del');
var concat = require('gulp-concat');

gulp.task('revImg',function(){
	return gulp.src('images/**/*')
		.pipe(rev())
		.pipe(gulp.dest('dist/images'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/images'));
});

gulp.task('revJs',function(){
	return gulp.src('js/**/*')
		.pipe(rev())
		.pipe(gulp.dest('dist/js'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/js'));
});

gulp.task('revCss',function(){
	return gulp.src('css/**/*')
		.pipe(rev())
		.pipe(gulp.dest('dist/css'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/css'));
});

gulp.task('jslint',function(){
	return gulp.src('js/**/*')
		.pipe(jshint({
			"undef" : false,
			"unused" : false
		}))
		.pipe(jshint.reporter('fail'));
});

//检测css
gulp.task('lintCss',function(){
	return gulp.src('css/**/*.css')
		.pipe(csslint({
			'box-sizing' :false,
			'ids' : false
		}))
		.pipe(csslint.reporter())
		.pipe(csslint.reporter('fail'));
});

//html引入文件版本
gulp.task('replaceHtml',function(cb){
	runSequence('clean',['revCss','revImg','revJs'],function(){
		gulp.src(['rev/**/*.json','views/**/*'])
			.pipe(revCollector())
			.pipe(gulp.dest('dist/views'));
			cb();
		});
});

//css引入文件版本
gulp.task('replaceCss',function(cb) {
	runSequence('clean',['revCss','revImg'],function(){
		gulp.src(['rev/**/*.json','dist/css/**/*'])
			.pipe(revCollector())
			.pipe(gulp.dest('dist/css'));
			cb();
		});
});

//js引入文件版本
gulp.task('replaceJs',function(cb) {
	runSequence('clean',['revCss','revImg','revJs'],function(){
		gulp.src(['rev/**/*.json','dist/js/**/*'])
			.pipe(revCollector())
			.pipe(gulp.dest('dist/js'));
			cb();
		});
});

//清空生成文件
gulp.task('clean',function(cb){
	return del('dist');
});
//合并压缩哈希文件
gulp.task('crypto',function(){
	return gulp.src(['js/lib/crypto-core-min.js','js/lib/md5-min.js','js/lib/hmac-min.js'])
		.pipe(concat('crypto-min.js',{
			newLine: ';'
		}))
		.pipe(gulp.dest('js/lib'));
});