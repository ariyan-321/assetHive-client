import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import React from 'react'


const stripePromise=loadStripe()

export default function Payment() {
  return (
    <div>
        <Elements stripe={stripePromise}>
            
        </Elements>
    </div>
  )
}
