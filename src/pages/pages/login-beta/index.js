import React from 'react'
import { Helmet } from 'react-helmet'

import axios from 'axios'
import FacebookLogin from 'react-facebook-login'
import cookie from 'react-cookies'
import styles from './style.module.scss'
import LoginForm from './LoginForm'

class LoginBeta extends React.Component {
  state = {
    fullScreen: true,
  }

  setFullscreen = () => {
    const { fullScreen } = this.state
    this.setState({
      fullScreen: !fullScreen,
    })
  }

  changeBackground = () => {}

  responseFacebook = response => {
    const { props } = this
    axios
      .post('/api/facebook', {
        user_id: response.userID,
        access_token: response.accessToken,
      })
      .then(result => {
        cookie.save('access_token', result.data.jwt_token, { path: '/' })
        props.history.push('/dashboard/alpha')
      })
  }

  render() {
    const { fullScreen } = this.state

    return (
      <div>
        <Helmet title="Login Beta" />
        <section
          className={`${styles.login} ${fullScreen ? styles.fullscreen : styles.windowed}`}
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/meshed-nyc/nicholas-green-324622-unsplash_umdttf.jpg')",
          }}
        >
          <header className={styles.header}>
            <a className={styles.logo} href="javascript: void(0);">
              <img src="resources/images/logo-inverse.png" alt="Clean UI Admin Template" />
            </a>

            <nav className={styles.loginNav}>
              <ul className={styles.navItems}>
                <li>
                  <a href="javascript: void(0);">&larr; Back</a>
                </li>
                <li>
                  <a className={styles.active} href="javascript: void(0);">
                    Login
                  </a>
                </li>
                <li>
                  <a href="javascript: void(0);">About</a>
                </li>
                <li>
                  <a href="javascript: void(0);">Support</a>
                </li>
              </ul>
            </nav>
          </header>
          <div className={styles.content}>
            <div className={styles.promo}>
              <h1 className="mb-3 text-white">Welcome to Sticky</h1>
              <p>We find sponsors for your thriving online communities</p>
            </div>
            <div className={styles.formWrapper}>
              <div className={styles.form}>
                <p className={styles.formTitle}>Please log in</p>
                <LoginForm />
              </div>
              <div className={styles.sidebar}>
                <p className={styles.sidebarTitle}>Facebook + Reddit</p>
                <div className={styles.sidebarContent}>
                  <p>
                    Are you the admin for a thriving Facebook group? Or perhaps a moderator for a
                    busy subreddit?
                  </p>
                  <p>
                    Managing and maintaining communities is not easy. Let sponsors compensate you!
                  </p>
                  <FacebookLogin
                    appId="2025808077727094"
                    autoLoad={false}
                    scope="public_profile,email,publish_to_groups"
                    icon="icmn-facebook mr-2"
                    callback={this.responseFacebook}
                    cssClass="btn btn-primary btn-block"
                    textButton="Connect with Facebook"
                  />
                  <button type="button" className="mt-2 btn btn-danger btn-block">
                    <i className="fa fa-reddit-alien" /> Connect with Reddit
                  </button>
                </div>
                <div className={styles.sidebarFooter}>
                  <span>
                    <i className="icmn-location mr-3" />
                    Made in Queens, New York
                  </span>
                </div>
              </div>
            </div>
          </div>
          <footer className={styles.footer}>
            <ul className={styles.footerNav}>
              <li>
                <a href="javascript: void(0);">Terms of Use</a>
              </li>
              <li>
                <a href="javascript: void(0);">Compliance</a>
              </li>
              <li>
                <a href="javascript: void(0);">Confidential Information</a>
              </li>
              <li>
                <a href="javascript: void(0);">Support</a>
              </li>
              <li>
                <a href="javascript: void(0);">Contacts</a>
              </li>
            </ul>
          </footer>
        </section>
      </div>
    )
  }
}

export default LoginBeta
