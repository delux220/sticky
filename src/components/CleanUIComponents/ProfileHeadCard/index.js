import React from 'react'

import styles from './style.module.scss'

class ProfileHeadCard extends React.Component {
  render() {
    const {user} = this.props;

   
    return (
      <div className={styles.card}>
        <div
          className={styles.head}
          style={{
            backgroundImage: `url('${user.cover_url}')`,
          }}
        >
          <h2 className="text-white">
            <strong>{user.name}</strong>
          </h2>
        </div>
        <div>
          <div className={styles.left}>
            <strong className="d-block">{user.member_count}</strong>
            <span className="text-muted">{user.member_count} members</span>
          </div>
          <div className={styles.right}>
            <p>{user.description}</p>
          </div>
        </div>
      </div>
    )
  }
}
export default ProfileHeadCard
