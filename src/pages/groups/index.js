import React from 'react'
import { Helmet } from 'react-helmet'
import cookie from 'react-cookies'
import axios from 'axios'

import ProfileHeadCard from 'components/CleanUIComponents/ProfileHeadCard'

const accessToken = cookie.load('access_token')

axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

class Groups extends React.Component {
  state = {
    groups: [],
    user: null,
  }

  componentDidMount() {
    axios.get('/api/groups').then(result => {
      this.setState({ groups: result.data.groups.data, user: result.data.user })
    })
  }

  render() {
    const { groups, user } = this.state

    return (
      <div>
        <Helmet title="Dashboard Beta" />
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              {groups.map(group => {
                return (
                  <div className="col-md-6">
                    <ProfileHeadCard group={group} user={user} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Groups
