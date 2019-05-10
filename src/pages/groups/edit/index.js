import React from 'react'
import { Helmet } from 'react-helmet'
import cookie from 'react-cookies'
import axios from 'axios'
import { EditorState, convertToRaw, convertFromRaw  } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import { Form, Select, Upload, Icon, Modal, notification } from 'antd'


import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const accessToken = cookie.load('access_token')
const FormItem = Form.Item
const { Option } = Select

axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

class Group extends React.Component {
  state = {
    previewVisible: false,
    fileList: [],
    previewImage: '',
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
      });

      group.groupCategories = cats;
      let editorState = EditorState.createEmpty();
      try {
          editorState = EditorState.createWithContent( convertFromRaw(JSON.parse(group.description_html)));
      } catch (e) {
          editorState = EditorState.createEmpty();
      }

      const {fileList} = this.state;
      group.images.forEach((image) => {
        fileList.push({
            uid: image.image_id,
            name: `${image.image_id}.jpg`,
            response: {

                uid: image.image_id,
                url: image.src_200
            },
            thumbUrl: image.src_200,
            type: 'image/jpeg'
        });
      })

      this.setState({ group, categories: result.data.categories, editorState })
    })
  }

  cloudinary = (obj) => {
   
    const uploadPreset = 'stodzapg';
    const { fileList } = this.state;

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target.result);
      const formData = new FormData();
      formData.append('upload_preset', uploadPreset);
      formData.append('file', e.target.result);
      axios.post(obj.action, formData, {
         headers: {'X-Requested-With': 'XMLHttpRequest'}
      }).then((results) => {
        fileList[fileList.length-1] = results[0].response;
    });
    }
    reader.readAsText(obj.file.slice(0, obj.file.size-1));
    
    
  }

  handleUpload = ({ fileList }) => {
    console.log(fileList);
    this.setState({ fileList })}

  save = () => {
    const { match } = this.props
    const { params } = match
    const { id } = params
    const { group, editorState, fileList } = this.state
    const { groupCategories } = group
    const price = group.price_per_day;
    const imageIds = [];
    fileList.forEach((file) => {
      imageIds.push(file.response.uid);
    });

    axios.post(`/api/groups/${id}`, {
        price_per_day: price,
        groupCategories,
        description_html: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        image_ids: imageIds
      }).then((result) => {
        this.setState({group: result.data.group});
        notification.success({
          placement: 'topRight',
          message: 'Saved',
          description: "Your group's details were updated.",
          duration: 3,
        });
        
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
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

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
                <FormItem label="Page Images">
                  <p className="text-muted">Upload any relevant images. Please be mindful of copyrighted material.</p>
                  <Upload
                    action="/api/images"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    withCredentials
                    onChange={this.handleUpload}
                  >
                    {fileList.length >= 3 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
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
