import React from 'react'
import { Helmet } from 'react-helmet'
import cookie from 'react-cookies'
import axios from 'axios'
import { Editor } from 'react-draft-wysiwyg'
import { Form } from 'antd'

const accessToken = cookie.load('access_token')
const FormItem = Form.Item

axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

class Group extends React.Component {
  state = {
    group: {},
  }

  componentDidMount() {
    const { match } = this.props
    const { params } = match
    const { id } = params

    axios.get(`/api/groups/${id}`).then(result => {
      this.setState({ group: result.data.group })
    })
  }

  render() {
    const { group } = this.state

    return (
      <div>
        <Helmet title="Dashboard Beta" />
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              <div className="card">
                <div className="card-body">
                  <h3>{group.name}</h3>
                  <div className="form-group">
                    <FormItem label="Content">
                      <Editor />
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Group
