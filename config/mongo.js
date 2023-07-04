const mongoose = require('mongoose')
mongoose.connect(process.env.DB_LINK)
.then(res => console.log('DB is connected'))
.catch(err => console.log(err))