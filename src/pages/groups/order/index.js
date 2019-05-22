import React from 'react'
import { Carousel, Breadcrumb, Rate, Form } from 'antd'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import { Link } from 'react-router-dom'
import StripeForm from './form'
import styles from './style.module.scss'
import data from './data.json'

const FormItem = Form.Item

class GroupOrder extends React.Component {
  state = {
    imgActiveStatus: [],
    images: data.images,
    rate: data.rate,
    group: null,
    finePrint: data.finePrint,
    total: 0,
    days: 1,
  }

  componentWillMount() {
    this.generateImgStatus()
  }

  componentDidMount() {
    const { match } = this.props
    const { params } = match
    const { id } = params
    axios.get(`/api/groups/${id}`).then(result => {
      const { group } = result.data
      const { days } = this.state
      const total = group.price_per_day * days
      this.setState({ group, total })
    })
  }

  generateImgStatus = () => {
    const { imgActiveStatus, images } = this.state
    images.forEach((img, index) => {
      imgActiveStatus[index] = 'not-active'
      if (index === 0) {
        imgActiveStatus[0] = 'active'
      }
    })
  }

  setActiveImg = imgNumber => {
    const { imgActiveStatus } = this.state
    imgActiveStatus.forEach((imgStatus, index) => {
      imgActiveStatus[index] = 'not-active'
      if (imgNumber === index) {
        imgActiveStatus[index] = 'active'
      }
    })
    this.setState({
      imgActiveStatus,
    })
  }

  refSlider = node => {
    this.slider = node
  }

  changeSlide = (e, index) => {
    e.preventDefault()
    this.slider.slick.innerSlider.slickGoTo(index)
    this.setActiveImg(index)
  }

  recalculateTotal = e => {
    const { group } = this.state
    let { total, days } = this.state
    days = e.target.value

    total = days * group.price_per_day
    this.setState({ days, total })
  }

  processOrder = result => {
    console.log(result)
  }

  render() {
    const { imgActiveStatus, rate, group, finePrint, days, total } = this.state

    if (group == null) {
      return (
        <div>
          <Helmet title="Group Details" />
        </div>
      )
    }

    return (
      <div>
        <Helmet title="Group Details" />
        <section className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>Facebook Group Details</strong>
            </div>
          </div>
          <div className="card-body">
            <Form>
              <div className="row">
                <div className="col-lg-4">
                  <div className={styles.item}>
                    <div className={styles.img}>
                      <div className={styles.status}>
                        <span className={styles.statusTitle}>New</span>
                      </div>
                      <div className={`${styles.like} ${styles.selectedLike}`}>
                        <i className="icmn-heart" />
                      </div>
                      <Carousel ref={this.refSlider} autoplay={false} dots={false} effect="fade">
                        {group.images.map(image => (
                          <div key={image.id}>
                            <img className={styles.img} src={image.src_500} alt="" />
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  </div>
                  <div className={`${styles.photos} clearfix`}>
                    {group.images.map((image, index) => (
                      <a
                        href="javascript: void(0)"
                        key={image.image_id}
                        onClick={e => {
                          this.changeSlide(e, index)
                        }}
                        className={`${styles.photosItem} ${
                          imgActiveStatus[index] === 'active' ? styles.photosItemActive : ''
                        }`}
                      >
                        <img src={image.src_200} alt="" />
                      </a>
                    ))}
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className={styles.breadcrumbs}>
                    <Breadcrumb separator="">
                      <Breadcrumb.Item>
                        <span className={styles.breadcrumbItem}>
                          <Link to={`/groups/${group.id}`}>{group.name.substr(0, 100)}</Link>
                        </span>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                        <span className={styles.breadcrumbItem}>
                          <a href="javascript: void(0);">Order</a>
                        </span>
                      </Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                  <div className={styles.sku}>
                    <div className={styles.raiting}>
                      <Rate value={rate} disabled allowHalf />
                    </div>
                  </div>
                  <h4 className={styles.mainTitle}>
                    <strong>{group.name}</strong>
                  </h4>

                  <FormItem label="How many days">
                    <div className="row">
                      <div className="col-xs-6 col-md-2">
                        <input
                          type="number"
                          name="days"
                          className="form-control py-4 text-center"
                          value={days}
                          id="days"
                          style={{ fontSize: '18px' }}
                          onChange={this.recalculateTotal}
                        />
                      </div>
                      <div className="col-xs-6">
                        <h3 className="font-weight-bold text-muted mt-2 px-3">
                          &times;{' '}
                          <span className="text-dark ml-2">
                            {`$${group.price_per_day}`} per day
                          </span>
                        </h3>
                      </div>
                    </div>
                  </FormItem>
                  <div>
                    <h3 className="text-success">
                      <span className="text-muted">Total:</span>{' '}
                      <span className="font-weight-bold">{`$${total}`}</span>
                    </h3>
                  </div>
                  <hr />
                  <div className={`mb-1 ${styles.descr}`}>
                    <StripeForm processOrder={this.processOrder} />
                    <p className="mt-3">{finePrint}</p>
                  </div>
                  <hr />
                </div>
              </div>
            </Form>
          </div>
        </section>
      </div>
    )
  }
}

export default GroupOrder
