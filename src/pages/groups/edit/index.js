import React from 'react'
import { Helmet } from 'react-helmet'
import cookie from 'react-cookies'
import axios from 'axios'
import { Editor } from 'react-draft-wysiwyg'
import { Form, Select } from 'antd'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const accessToken = cookie.load('access_token')
const FormItem = Form.Item
const { Option } = Select;

axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

class Group extends React.Component {
  state = {
    group: {},
    categories: []
  }

  componentDidMount() {
    const { match } = this.props
    const { params } = match
    const { id } = params

    axios.get(`/api/groups/${id}`).then(result => {
      this.setState({ group: result.data.group, categories: result.data.categories });
    })
  }

  render() {
    const { group, categories } = this.state


    return (
      <div>
        <Helmet title="Dashboard Beta" />
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h3>{group.name}</h3>
                <div className="form-group">
                  <FormItem label="Description">
                    <div style={{padding: '1rem', border:'1px solid #eee'}}>
                      <Editor />
                    </div>
                  
                  </FormItem>
                </div>
                <Select mode="multiple">
                  {categories.map((cat) => {
                      return (<Option key={cat.id} value={cat.id}>{cat.name}</Option>);
                  })}
                </Select>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    )
  }
}

export default Group
