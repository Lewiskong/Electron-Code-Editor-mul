var gulp=require('gulp');
var sass=require('gulp-sass');

gulp.task('default',function(){
	gulp.run('less_compile');
	gulp.watch('src/*.scss',['less_compile']);
})

gulp.task('less_compile',function(){
	gulp.src('src/**/*.scss')
		.pipe(sass())
		.on('error', function(err) {
        console.log('Less Error!', err.message);
        this.end();
     })
	.pipe(gulp.dest('src'))
})

