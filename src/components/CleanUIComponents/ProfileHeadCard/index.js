import React from 'react'
import Avatar from 'components/CleanUIComponents/Avatar'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

class ProfileHeadCard extends React.Component {
  render() {
    const { group, user } = this.props
    const cover =
      group.cover_url == null
        ? 'https://res.cloudinary.com/meshed-nyc/w_920,h_480,c_fill/background_v7ho1s.jpg'
        : group.cover_url

    return (
      <div className={styles.card}>
        <div
          className={styles.head}
          style={{
            backgroundImage: `url('${cover}')`,
          }}
        >
          <h2 className="text-white">
            <strong>{group.name}</strong>
          </h2>
        </div>
        <div>
          <div className={styles.left}>
            <Avatar user={user} size="110" />
            <span className="text-dark d-block font-weight-bold text-center">
              {group.member_count} members
            </span>
          </div>
          <div className={styles.right}>
            <div className={styles.rightInner}>
              <p className="text-muted">
                {group.description.substr(0, 355)}
                {group.description.length > 355 && '...'}
              </p>
            </div>
            <div className="text-left">
              <Link to={`/groups/${group.id}`} className="btn btn-primary mr-2">
                View Group
              </Link>
              <Link to={`/groups/${group.id}/edit`} className="btn btn-info-light">
                Edit Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default ProfileHeadCard