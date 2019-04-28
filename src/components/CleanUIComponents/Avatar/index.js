import React from 'react'
import style from './style.module.scss'

class Avatar extends React.Component {
  static defaultProps = {
    size: false,
    border: false,
    borderColor: '#d2d9e5',
    src: '',
  }

  render() {
    const { size, borderColor, border, user } = this.props
    console.log(user)
    const imageId = user.image_id != null ? user.image_id : 'bagel2-compressor_oc5m4t'

    return (
      <a
        className={`${style.avatar} ${size ? style[`size${size}`] : ''} ${
          border ? style.border : ''
        }`}
        href="javascript: void(0);"
        style={{
          borderColor,
        }}
      >
        <img
          src={`https://res.cloudinary.com/meshed-nyc/w_150,h_150,c_fill/${imageId}.jpg`}
          alt="User"
        />
      </a>
    )
  }
}

export default Avatar
