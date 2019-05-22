import React from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import InjectedForm from './injectedForm'

class StripeForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { stripe: null, errorMessage: false }
  }

  componentDidMount() {
    const stripeScript = document.createElement('script')
    stripeScript.id = 'stripe-js'
    stripeScript.src = `https://js.stripe.com/v3/`
    stripeScript.async = true
    stripeScript.onload = () =>
      this.setState({ stripe: window.Stripe('pk_test_GAqizDjvpp1mxq69CuM4gSNq00jxMDGmIf') })

    document.body.appendChild(stripeScript)

    if (window.Stripe) {
      this.setState({ stripe: window.Stripe('pk_test_GAqizDjvpp1mxq69CuM4gSNq00jxMDGmIf') })
    }
  }

  submitOrder = result => {
    console.log(result)
    const { processOrder } = this.props
    processOrder(result)
  }

  handleChange = err => {
    if (err) {
      this.setState({ errorMessage: err.message })
    }
  }

  render() {
    const { stripe, errorMessage } = this.state

    return (
      <div>
        <StripeProvider stripe={stripe}>
          <Elements>
            <InjectedForm handleResult={this.submitOrder} />
          </Elements>
        </StripeProvider>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </div>
    )
  }
}

export default StripeForm
