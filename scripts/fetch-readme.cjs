const fs = require('node:fs')
const https = require('node:https')

https.get(
  'https://raw.githubusercontent.com/0110wdj/Stark-Mansion-Lab-One/master/README.md',
  res => {
    let data = ''
    res.on('data', chunk => {
      data += chunk
    })
    res.on('end', () => {
      const about = fs.readFileSync('./src/content/spec/about.md', 'utf-8')
      const newAbout = about.replace(
        '<!-- INJECT:README -->',
        `\n\n${data}\n\n`,
      )
      fs.writeFileSync('./src/content/spec/about.md', newAbout)
    })
  },
)
