const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/5e35cca39b9403eea9e2dc82a5513a10/'+latitude+','+longitude;

    request({ url, json:true }, (error, { body }) => {
        if(error){
            callback('Unable to connect to weather services', undefined);
        } else if (body.error) {
            callback(body.error, undefined);
        } else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + '.' +
         'There is a ' + body.currently.precipProbability + ' % chance of rain.' +
         'The UV Index today is ' + body.daily.data[0].uvIndex);
        }
    })
}

module.exports = forecast;