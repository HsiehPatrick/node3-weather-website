//core node modules
const path = require('path');

//npm modules
const express = require('express');
const hbs = require('hbs');
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

//Define paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

//Setup handlebars enging and views location
app.set('view engine', 'hbs'); //(type, module name)
app.set('views', viewsPath); //(customizing views folder, point to this path)
hbs.registerPartials(partialPath);

//Setup static directory to serve- Express looks at request in order
app.use(express.static(publicDirPath)); //look in public directory - static pages

app.get('', (req,res) => {

    /*use render method to render a view template. Just use the name of the file in the views folder. default must be name 'views'
    Second argumnet: objects that have values to pass into handlebar
    */
    res.render('index', {
        title: 'Weather',
        name: 'Patty H'
    }); 
});

app.get('/about', (req, res) => {
    res.render('about', {
       title: 'About Me',
       name: 'Patrick H' 
    });
});

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        name: 'Patrick Hsieh',
        helpMsg: 'This is some helpful text.'
    });
});

app.get('/weather', (req, res) => {  // (partial route/subdomain, function (request, response) {})- function to handles what to do when user visits
    
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geoCode(req.query.address, (error, {longitude, latitude, location} = {}) => {

        if(error) {
            return res.send({ error }); // return ends the callback function execution for geoCode, shorthand syntax for setting error variable to error from geoCode
        }
    
        forecast(longitude, latitude, (error, forecastData) => {
            if(error) {
                return res.send({ error }); //return ends the callback function execution fo forecast
            };

            res.send({
                address: req.query.address,
                location,
                forecast: forecastData
            });
        });
    });
});

app.get('/products', (req, res) => {
    
    if (!req.query.search) {
        /*if terminal throws error: Cannont set headers after they are sent to the client, it means we are sending back twice. 
            use 'return' to end function, or if/else to limit down to one response.*/
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search);
    
    res.send({
        products: []
    })
});

app.get('/help/*', (req, res) => { // for all pages within another subdomain
    res.render('404', {
        title: '404',
        name: 'Pattickles',
        errorMsg: 'Help article not found.'
    })
});

app.get('*', (req, res) => { // use * in url section for all other routes/subdomain not listed for 404 page.
    res.render('404', {
        title: '404',
        name: 'Pattickles',
        errorMsg: 'Page not found'
    });

});

app.listen(3000, () => {//starts to listen aka starts server. takes argument a port, and callback function. Common dev port is 3000.
    console.log('Server is up on port 3000');
});