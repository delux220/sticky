import React from 'react'
import { Helmet } from 'react-helmet'
import cookie from 'react-cookies'
import axios from 'axios'

import { Link } from 'react-router-dom'


const accessToken = cookie.load('access_token')

axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

class Order extends React.Component {
  state = {
    order: null
  }

  componentDidMount() {

    const {match} = this.props;
    const {params} = match;
    const {id} = params;
    axios.get(`/api/orders/${id}`).then(result => {
      const {data} = result;
      const {order} = data;
      this.setState({ order });
    })
  }

  render() {
    const { order } = this.state;
    console.log(order);
    if (order == null) {
      return <div />
    }
    return (
      <div>
        <Helmet title="Order" />
        <section className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong><Link to="/orders">Orders</Link> / Order #{order.order_number}</strong>
            </div>

          </div>
        </section>
       
      </div>
    )
  }
}

export default Order
