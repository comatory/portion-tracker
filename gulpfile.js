
const gulp = require('gulp')
const { spawn } = require('child_process')

gulp.task('default', (cb) => {
  console.info('No default task specified.')
  cb()
})

// NOTE: This runs build task in frontend module
//       and copies the result in "public" folder
gulp.task('prepublish', (cb) => {
  process.chdir('./frontend')

  const cmd = spawn('npm', [ 'run', 'build' ])

  cmd.stderr.setEncoding('utf8')
  cmd.stdout.setEncoding('utf8')
  cmd.stderr.on('data', data => console.info(data))
  cmd.stdout.on('data', data => console.info(data))

  cmd.on('close', (output) => {
    process.chdir('../')
    gulp.src('./frontend/dist/*.*').pipe(gulp.dest('./public'))
    cb(output)
  })
})
