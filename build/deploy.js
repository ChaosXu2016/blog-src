const { exec } = require('child_process');
const path = require('path')
exec('yarn docs:build', {}, function() {
  exec('git init', {cwd: path.resolve('./docs/.vuepress/dist/')}, function () {
    console.log('git init')
    exec('git add -A', {cwd: path.resolve('./docs/.vuepress/dist/')}, function() {
      console.log('git add -A')
      exec('git commit -m \'deploy\'', {cwd: path.resolve('./docs/.vuepress/dist/')}, function() {
        exec('git push -f https://github.com/ChaosXu2016/blog.git master:gh-pages', {cwd: path.resolve('./docs/.vuepress/dist/')}, function() {
          console.log('deploy success')
        })
      })
    })
  })
})
