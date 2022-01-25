import React, {useState, useContext, useEffect} from 'react';
import { Link, useHistory, useParams } from "react-router-dom"
import {
  Col,
  Row,
  Card,
  Form,
} from "reactstrap"

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML  } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';

import { WithContext as ReactTags } from 'react-tag-input';

import Dropzone from "react-dropzone"

import { AuthContext } from '../context/AuthState';
import { BlogContext } from '../context/BlogState';



const Home = (props) => {
  const userData = useContext(AuthContext);
  const {addBlog, getBlog, saveBlog} = useContext(BlogContext);
  const history = useHistory();

  let { blogId } = useParams();
  
  useEffect(() => {
    getBlog(blogId).then((res) => {
        if(res.msg != "Server error"){
            setBlog({
                ...blog,
                title: res[0].title,
                cta: res[0].cta
            });
            const blocksFromHTML = convertFromHTML(res[0].text);
            const state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );
            setEditorState(EditorState.createWithContent(state));
            convertContentToHTML();
            console.log('editorReference')
            editorReference.focus()
            console.log('editorReference')
            // document.getElementsByClassName('DraftEditor-root')[0].focus
            setSelectedFiles([{name: "Blog-"+res[0]._id, type: "image/jpeg", preview: res[0].image}])
            let tagsHolder = [];
            if(res[0].tags && res[0].tags.length > 0){
                res[0].tags.forEach((tag) => {
                    tagsHolder.push({id: tag, text: tag});
                });
                setTags(tagsHolder);
            }
        }
    });
  }, [blogId]);



  const setEditorReference = (ref) => {
    if(ref ){
      console.log('setting ref')
      setReference(ref)
      // ref.focus()
    }
  }

  
  useEffect(() => {
    if(!localStorage.getItem('user')){
      history.push('/login');
    }
  }, [localStorage.getItem('user')]);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorReference, setReference] = useState(EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState();
  const onEditorStateChange = (editorState) => {
    console.log('Editor state');
    console.log(editorState);
    
    setEditorState(editorState);
    convertContentToHTML();
  }

  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
    console.log(currentContentAsHTML)
  }

  const createMarkup = (html) => {
    return  {
      __html: DOMPurify.sanitize(html)
    }
  }

  const KeyCodes = {
    comma: 188,
    enter: [10, 13],
  };

  const delimiters = [...KeyCodes.enter, KeyCodes.comma]


  const [tags, setTags] = useState([
      { id: "Security", text: "Security" },
      { id: "Business", text: "Business" }
  ])
  const [blog, setBlog] = useState({})
  const [userFile, setUserFile] = useState({})
  const [blogImage, setBlogImage] = useState({})
  const [selectedFiles , setSelectedFiles] = useState([])


  function handleAcceptedFiles(files) {
    files.map(file => {

      const reader = new FileReader();

      reader.readAsDataURL(file);
            reader.onloadend = () => {
                if(file.type == 'application/pdf' || file.type == 'image/png' || file.type == 'image/jpeg') {
                  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                  let today  = new Date();
                  setUserFile({name: file.name, url: reader.result, date: today.toLocaleDateString("en-US", options)})
                }
            };
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    })
    setSelectedFiles(files)
    console.log(files)
  }

  const handleDelete = (i) => {
    let tagsFiltered = tags.filter((tag, index) => index !== i);
    setTags(tagsFiltered)
  }

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  }

  const handleDrag = (tag, currPos, newPos) => {
      const tags = [...tags];
      const newTags = tags.slice();

      newTags.splice(currPos, 1);
      newTags.splice(newPos, 0, tag);

      // re-render
    setTags(newTags);
  }


  const updateField = e => {
    setBlog({
        ...blog,
        [e.target.name]: e.target.value
    });
};

  const uploadBlog = () => {
    let obj = {
      title: blog.title,
      cta: blog.cta,
      text: convertedContent,
      image: userFile.url,
      creator: localStorage.getItem('name'),
      tags: tags,
    }
    
    addBlog(obj)
  }

  const updateBlog = () => {
    let obj = {
        title: blog.title,
        cta: blog.cta,
        text: convertedContent,
        image: userFile.url,
        creator: localStorage.getItem('name'),
        tags: tags,
        _id: blogId
    }
      
    saveBlog(obj)
  }


  return (


    
    <div className="App">
      <header className="App-header">
        Toppstation - Dashboard
      </header>
      <div className="container">

        <div className="jumbotron tagsContainer">
          <h4 className="">Blog Title</h4>
          <input type="text" id="email" className="form-control" name="title" placeholder="Blog title" value={blog.title||""} onChange={updateField}/>
        </div>

        <div className="jumbotron tagsContainer">
          <h4 className="">CTA Link</h4>
          <input type="text" id="link" className="form-control" name="cta" placeholder="Call to action link" value={blog.cta||""} onChange={updateField}/>
        </div>

        <div className="jumbotron tagsContainer">
          <h4 className="">Blog Cover</h4>

          <Form>
              <Dropzone
                onDrop={acceptedFiles => {
                  handleAcceptedFiles(acceptedFiles)
                }}
                multiple={false}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="dropzone dz-clickable">
                    <div
                      className="dz-message needsclick"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <div className="mb-3">
                        <i className="display-4 text-muted mdi mdi-upload-network-outline"></i>
                      </div>
                      <h4>Drop files here or click to upload.</h4>
                    </div>
                  </div>
                )}
              </Dropzone>
              <div className="dropzone-previews mt-3" id="file-previews">
                {selectedFiles.map((f, i) => {
                  return (
                    <Card
                      className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                      key={i + "-file"}
                    >
                      <div className="p-2">
                        <Row className="align-items-center">
                          <Col className="col-auto">
                            <img
                              data-dz-thumbnail=""
                              height="80"
                              className="avatar-sm rounded bg-light"
                              alt={f.name}
                              src={f.preview}
                            />
                          </Col>
                          <Col>
                            <Link
                              to="#"
                              className="text-muted font-weight-bold"
                            >
                              {f.name}
                            </Link>
                            <p className="mb-0">
                              <strong>{f.formattedSize}</strong>
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </Form>
          </div>

          <div className="jumbotron tagsContainer">
            <h4 className="">Content</h4>
            <Editor
            editorState={editorState}
            toolbarClassName="toolbar-class"
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            onEditorStateChange={onEditorStateChange}
            editorRef={setEditorReference}
            id="testIdForEditor"
          />
        </div>

        {/* <div className="preview" dangerouslySetInnerHTML={createMarkup(convertedContent)}></div> */}

        <div className="jumbotron tagsContainer">
          <h4 className="">Tags</h4>
            <div className="">
              <ReactTags tags={tags}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        handleDrag={handleDrag}
                        delimiters={delimiters}
                        classNames={{
                          tags: 'container',
                          tagInput: 'tagInputClass tagInput',
                          tagInputField: 'form-control',
                          selected: 'selectedClass',
                          tag: 'btn btn-primary tag',
                          remove: 'btn btn-danger removeTag'
                        }}
                        />
              </div>
        </div>

        <div className="jumbotron tagsContainer text-center">
          <button className="btn btn-warning m-5">
                x Reset Page
          </button>
        {!blogId && <button className="btn btn-success m-5" onClick={() => uploadBlog()}>
                + Uplaod Blog
          </button> || <button className="btn btn-warning m-5" onClick={() => updateBlog()}>
                Update Blog
          </button>}
          
        </div>

      </div>
    </div>

  )
}



export default Home;
