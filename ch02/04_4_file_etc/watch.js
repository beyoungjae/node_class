const fs = require('fs')

fs.watch('./readme4.txt', (eventType, filename) => {
   console.log(eventType, filename)
})
