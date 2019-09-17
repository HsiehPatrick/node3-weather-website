const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

//messageOne.textContent = 'From Javascript';

weatherForm.addEventListener('submit', (e) => { // e for eventobject (how to access the event)
    e.preventDefault(); // browser refreshes page by default when submit button is pressed 

    const location = search.value;

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = '';

    //Fetch is client side javascript.
    //string url to fetch data from .then is the 'callback function' for fetch
    // '/' on local will use the current domain (localhost:3000 if on local, and herokuURL) and adding on the page after for the query.
    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if(data.error) {
                messageOne.textContent = data.error;
            } else {
                messageOne.textContent = data.location;
                messageTwo.textContent = data.forecast;
            };
        });
    });
});