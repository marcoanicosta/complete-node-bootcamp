/* eslint-disable*/
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';


//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('form--login')
const logOutBtn = document.querySelector('.nav__el--logout')

//VALUES


//DELEGATION
if(mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
    //console.log(locations);
}

if(loginForm) 
    loginForm.addEventListener('submit', e => {
        e.preventDefault(); //Prevents the form from loading any other page
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
});

if(logOutBtn) logOutBtn.addEventListener('click', logout)

