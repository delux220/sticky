import React from 'react'
import { Helmet } from 'react-helmet'
import cookie from 'react-cookies'
import axios from 'axios'
import { EditorState, convertToRaw, convertFromRaw  } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import { Form, Select } from 'antd'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const accessToken = cookie.load('access_token')
const FormItem = Form.Item
const { Option } = Select

axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

class Group extends React.Component {
  state = {
    group: null,
    categories: [],
    editorState: EditorState.createEmpty(),
  }

  componentDidMount() {
    const { match } = this.props
    const { params } = match
    const { id } = params

    axios.get(`/api/groups/${id}`).then(result => {
      const { group } = result.data
      const cats = []
      group.group_categories.forEach(cat => {
        cats.push(cat.category_id)
      })

      group.groupCategories = cats;
      let editorState = EditorState.createEmpty();
      try {
          editorState = EditorState.createWithContent( convertFromRaw(JSON.parse(group.description_html)));
      } catch (e) {
          console.log(e);
          editorState = EditorState.createEmpty();
      }

      this.setState({ group, categories: result.data.categories, editorState })
    })
  }

  save = () => {
    const { match } = this.props
    const { params } = match
    const { id } = params
    const { editorState, group } = this.state
    const { groupCategories } = group
    const price = group.price_per_day

    axios
      .post(`/api/groups/${id}`, {
        price_per_day: price,
        groupCategories,
        description_html: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      })
      .then(result => {
        console.log(result)
      })
  }

  handleCategoryChange = value => {
    const { group } = this.state
    group.groupCategories = value

    this.setState({ group })
  }

  handlePriceChange = e => {
    const { group } = this.state
    group.price_per_day = e.target.value
    console.log(group)
    this.setState({ group })
  }

  changeEditorState = editorState => {
    this.setState({ editorState })
  }

  render() {
    const { group, categories, editorState } = this.state

    if (group == null) {
      return <div />
    }

    return (
      <div>
        <Helmet title="Dashboard Beta" />
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h3>{group.name}</h3>
                <div className="form-group">
                  <FormItem label="Group Description">
                    <p className="text-muted">
                      This description is displayed to interested sponsors, not group members. Help
                      sponsors understand what this group is about.
                    </p>
                    <div style={{ padding: '1rem', border: '1px solid #eee' }}>
                      <Editor
                        editorState={editorState}
                        onEditorStateChange={this.changeEditorState}
                      />
                    </div>
                  </FormItem>
                </div>
                <FormItem label="Categories">
                  <p className="text-muted">Help relevant sponsors find you</p>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    onChange={this.handleCategoryChange}
                    value={group.groupCategories}
                  >
                    {categories.map(cat => {
                      return (
                        <Option key={cat.id} value={cat.id}>
                          {cat.name}
                        </Option>
                      )
                    })}
                  </Select>
                </FormItem>
                <FormItem label="Price per day ($)">
                  <p className="text-muted">
                    How much do you want to charge per day for a sticky post in your group?
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    name="price"
                    placeholder="0.00"
                    onChange={this.handlePriceChange}
                    value={group.price_per_day}
                  />
                </FormItem>
                <button className="btn btn-primary" type="button" onClick={this.save}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Group
