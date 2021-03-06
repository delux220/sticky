import React from 'react'
import { Carousel, Breadcrumb, Rate,  Icon, Tabs } from 'antd'
import { Helmet } from 'react-helmet'
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Editor, EditorState, convertFromRaw } from "draft-js";
import styles from './style.module.scss'
import data from './data.json'

const { TabPane } = Tabs

class GroupDetails extends React.Component {
  state = {
    imgActiveStatus: [],
    images: data.images,
    sku: data.sku,
    rate: data.rate,
    group: null
  }

  componentWillMount() {
    this.generateImgStatus()
  }

  componentDidMount() {
    const {match} = this.props;
    const {params} = match;
    const {id} = params;
    axios.get(`/api/groups/${id}`).then((result) => {
        const {group} = result.data;
        this.setState({group});
    });
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

  render() {
    const {
      imgActiveStatus,
      sku,
      rate,
      group,
    } = this.state


    if (group == null) {
      return <div />
    }


    const contentState = convertFromRaw(JSON.parse(group.description_html));
    const editorState = EditorState.createWithContent(contentState);

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
                        <a href="javascript: void(0);">Catalog</a>
                      </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <span className={styles.breadcrumbItem}>
                        <a href="javascript: void(0);">Facebook Groups</a>
                      </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <span className={styles.breadcrumbItem}>
                        <a href="javascript: void(0);">Social</a>
                      </span>
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                <div className={styles.sku}>
                  {`SKU: #${sku}`}
                  <br />
                  <div className={styles.raiting}>
                    <Rate value={rate} disabled allowHalf />
                  </div>
                </div>
                <h4 className={styles.mainTitle}>
                  <strong>{group.name}</strong>
                </h4>
                <div className={styles.price}>
                  {`$${group.price_per_day}`}
                  <span style={{fontSize:'14px', marginLeft: '5px'}}>per day</span>
                </div>
                <hr />
                <div className={`mb-1 ${styles.descr}`}>
                  <p>
                    <Editor editorState={editorState} readOnly />
                  </p>
                </div>
               
                <hr />
                <div className={styles.controls}>
                  <Link className="btn btn-primary btn-block" to={`/groups/${group.id}/order`}>
                    <Icon type="shopping-cart" className="mr-2" />
                    <strong>Buy Sticky Post</strong>
                  </Link>
                  
                </div>
                <div className={styles.info}>
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Information" key="1">
                      <div className="mb-1">
                        <strong className="mr-1">Platform:</strong>
                        Facebook
                      </div>
                      <div className="mb-1">
                        <strong className="mr-1">Member Count:</strong>
                        {group.member_count}
                      </div>
                    </TabPane>
                    <TabPane tab="Group Description" key="2">
                      <p>{group.description}</p>
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default GroupDetails
