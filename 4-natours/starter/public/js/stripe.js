/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts'
const stripe = Stripe('pk_test_51MBoh3AX0JD9Xq05iC2ujnHG5HsK9wJ5Uc5L75QpEtSAAc8NYNBVGXGCjDPgiwefW1ZEoa1ORhqJATLn1hnNz6ai00ZJQZlIvA')

export const bookTour = async tourId => {
    try {
        //1) Get session from API
        const session = await axios(`/api/v1/bookings/checkout-sessions/${tourId}`); //awaiting a http request
        //console.log(session);

        //2)) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

    } catch(err) {
        console.log(err);
        showAlert('error', err);
    }
};