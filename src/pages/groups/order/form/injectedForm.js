import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'

class InjectedForm extends Component {
  state = {
    errorMessage: '',
  }

  handleChange = ({ error }) => {
    if (error) {
      this.setState({ errorMessage: error.message })
    }
  }

  handleSubmit = evt => {
    evt.preventDefault()
    const { stripe, handleResult } = this.props
    if (stripe) {
      console.log('hello')
      stripe.createToken().then(handleResult)
    } else {
      console.log("Stripe.js hasn't loaded yet.")
    }
  }

  render() {
    const { errorMessage } = this.state
    return (
      <div className="CardDemo">
        <div style={{ border: '1px solid #eee', padding: '18px' }}>
          <CardElement onChange={this.handleChange} />
        </div>
        <div className="error" role="alert">
          {errorMessage}
        </div>
        <button
          className="btn btn-primary btn-block"
          type="button"
          onClick={this.handleSubmit}
          style={{ fontWeight: 'bold' }}
        >
          Purchase Sticky Posts
        </button>
      </div>
    )
  }
}

export default injectStripe(InjectedForm)
