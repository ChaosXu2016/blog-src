const { exec } = require('child_process');
const path = require('path')
const config = require('../config')
exec('yarn docs:build', {}, function() {
  exec('git init', {cwd: path.resolve(config.dest)}, function () {
    console.log('git init')
    exec('git add -A', {cwd: path.resolve(config.dest)}, function() {
      console.log('git add -A')
      exec('git commit -m \'deploy\'', {cwd: path.resolve(config.dest)}, function() {
        exec(`git push -f ${config.deploy.remote} master:gh-pages`, {cwd: path.resolve(config.dest)}, function() {
          console.log('deploy success')
        })
      })
    })
  })
})
