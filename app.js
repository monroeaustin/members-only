const express = require ('express');
const app = express();
const MainRoute = require('./routes/mainroute');
const path = require("node:path");

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public'
)))


app.use('/',MainRoute)



app.listen(3000,() => {
    console.log('APP LIVE')
})