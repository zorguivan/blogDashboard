import React, {useState, useContext, useEffect} from 'react';
import { Link, useHistory, useParams } from "react-router-dom"
import {
  Col,
  Row,
  Card,
  Form,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap"

import TextEditor from "./TextEditor.js";

import { WithContext as ReactTags } from 'react-tag-input';

import Dropzone from "react-dropzone"

import { AuthContext } from '../context/AuthState';
import { BlogContext } from '../context/BlogState';



const Home = (props) => {
  const userData = useContext(AuthContext);
  const {addBlog, getBlog, saveBlog, removeBlog} = useContext(BlogContext);
  const [textData, setTextData] = useState("");

  const handleTextChange = (newData) => {
      setTextData(newData);
  };

  const extraProps = {
    disabled : false,
  }

  useEffect(() => {
    console.log(textData);
  }, [textData]);

  const [tags, setTags] = useState([])
  const [blog, setBlog] = useState({
    visibility: true
  })
  const [userFile, setUserFile] = useState({})
  const [blogImage, setBlogImage] = useState({})
  const [selectedFiles , setSelectedFiles] = useState([]);
  const [show, setShow] = useState(false);

  const history = useHistory();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  let { blogId } = useParams();
  
  useEffect(() => {
      getBlog(blogId).then((res) => {
        if(res.msg != "Server error"){
            setBlog({
                ...blog,
                title: res[0].title,
                cta: res[0].cta,
                ctaText: res[0].ctaText,
                description: res[0].description,
                visibility: res[0].visibility
            });

            setTextData(res[0].text);

            setSelectedFiles([{name: "Blog-"+res[0]._id, type: "image/jpeg", preview: res[0].image}])
            let tagsHolder = [];
            if(res[0].tags && res[0].tags.length > 0){
                res[0].tags.forEach((tag) => {
                    tagsHolder.push({id: tag, text: tag});
                });
                setTags(tagsHolder);
            }
            // editorReference.focus()
            // document.getElementsByClassName('DraftEditor-root')[0].focus
        }
      });
  }, [blogId]);

  useEffect(() => {
    if(!localStorage.getItem('user')){
      history.push('/login');
    }
  }, [localStorage.getItem('user')]);


  const KeyCodes = {
    comma: 188,
    enter: [10, 13],
  };

  const delimiters = [...KeyCodes.enter, KeyCodes.comma]


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
    if(e.target.name == 'visibility'){
      setBlog({
        ...blog,
        [e.target.name]: e.target.checked
      });
    } else { 
      setBlog({
        ...blog,
        [e.target.name]: e.target.value
    });
    }
    
};

  const uploadBlog = () => {
    let obj = {
      title: blog.title,
      description: blog.description,
      cta: blog.cta,
      ctaText: blog.ctaText,
      visibility: blog.visibility,
      text: textData,
      image: userFile.url,
      creator: localStorage.getItem('name'),
      creatorId: localStorage.getItem('user'),
      tags: tags,
    }
    addBlog(obj)
    reset();
  }

  const reset = () => {
    history.go(0)
  }

  const updateBlog = () => {
    let obj = {
        title: blog.title,
        description: blog.description,
        cta: blog.cta,
        ctaText: blog.ctaText,
        visibility: blog.visibility,
        text: textData,
        image: userFile.url,
        creator: localStorage.getItem('name'),
        creatorId: localStorage.getItem('user'),
        tags: tags,
        _id: blogId
    }
    if(obj.image == undefined) { 
      obj.image = selectedFiles[0].preview
    }
    saveBlog(obj)
    reset();
  }

  const logout = () => {
    localStorage.clear();
  }


  

  const blogDelete = (id) => {
    removeBlog(id)
    history.push('/blogs')
  }

  return (
    <div className="App">
      <header className="header_new py-2 position-relative">
      <nav
        className="navbar navbar-light navbar-expand-md bg-faded justify-content-center"
      >
        <div className="container d-flex mobile-grid gap-2">
          <a href="/" className="navbar-brand text-center"
            ><img src="./Images/logo.svg" className="nav-logo" alt="Logo" /></a
          ><button
            className="navbar-toggler order-first order-md-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mynavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="header-chat-btn d-md-none">
            <a href="/about-us" title="" className="d-inline-block">Log Out</a>
          </div>
          <div className="collapse navbar-collapse w-100" id="mynavbar">
            <ul className="navbar-nav w-100 justify-content-center">
              <li className="nav-item active">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./blogs">All Blogs</a>
              </li>
            </ul>
          </div>
          <div className="header-chat-btn d-none d-md-block">
            <a  href="" onClick={() => logout()} title="">Log Out</a>
          </div>
        </div>
      </nav>
    </header>
      <div className="container">

        <div className="jumbotron tagsContainer">
          <h4 className="">Blog Title</h4>
          <input type="text" id="email" className="form-control" name="title" placeholder="Blog title" value={blog.title||""} onChange={updateField}/>
        </div>
        <div className="jumbotron tagsContainer">
          <h4 className="">Description</h4>
          <textarea  name="description"  className="form-control" value={blog.description||""} onChange={updateField} rows="4"> </textarea>
        </div>
        <div className="jumbotron tagsContainer">
          <h4 className="">CTA Link</h4>
          <input type="text" id="link" className="form-control" name="cta" placeholder="Call to action link" value={blog.cta||""} onChange={updateField}/>
        </div>
        <div className="jumbotron tagsContainer">
          <h4 className="">CTA Text</h4>
          <input type="text" id="link" className="form-control" name="ctaText" placeholder="Call to action button name" value={blog.ctaText||""} onChange={updateField}/>
        </div>

        <div className="form-check">
          <input className="form-check-input" type="checkbox" name="visibility" checked={blog.visibility || ''} onChange={updateField} />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Visible
          </label>
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
                          <Col className="col-auto coverContainer">
                            <img
                              data-dz-thumbnail=""
                              height="auto"
                              className="avatar-sm rounded bg-light"
                              alt={f.name}
                              src={f.preview}
                            />
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
            <TextEditor 
              data={textData} 
              onEditorReady={ () => console.log("Editor is ready")} // can write some function here if you need :)
              onChangeData={handleTextChange}
              {...extraProps}
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
                          tags: 'container my-4',
                          tagInput: 'tagInputClass tagInput my-4',
                          tagInputField: 'form-control',
                          selected: 'selectedClass',
                          tag: 'blog-added-tag py-2',
                          remove: 'fas align-middle delete-btn removeTag'
                        }}
                        />
              </div>
        </div>

        <div
          className="blog__buttons-wrapper my-5 d-flex flex-wrap align-items-center justify-content-center gap-3"
        >
          {blogId && <button className="delete-button" onClick={handleShow}  >
            Delete
          </button> }
          
          {!blogId && <button type="button" className="publish-button"  onClick={() => uploadBlog()}>
                Publish
          </button> || <button type="button" className="publish-button" onClick={() => updateBlog()} >
                Update
          </button>}

          

        </div>

      </div>

      <footer className="footer-main footer shadow-lg">
      <a href="#" title="" className="bottom-to-top-btn"
        ><i className="fas fa-chevron-up"></i><span>TOP</span></a
      >
      <div
        className="container d-flex justify-content-between align-items-center flex-column flex-xl-row"
      >
        <figure><img src="./Images/logo.svg" alt="logo" className="footer-logo"/></figure>
      </div>
    </footer>


      <Modal show={show} onHide={handleClose}>
          
          <ModalBody>Are you sure you want to delete this blog ?</ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="danger" >
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
        

        <Modal isOpen={show} toggle={handleClose}>
          <ModalHeader toggle={handleClose}>Delete Blog ? </ModalHeader>
          <ModalBody>
              Are you sure you want to delete this Blog ? 
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => blogDelete(blogId)}>Delete</Button>{' '}
            <Button color="secondary" onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </Modal>

    </div>

  )
}



export default Home;
