import React, {useState, useContext, useEffect} from 'react';
import { useHistory } from "react-router-dom"
import { Table, Button } from 'reactstrap';

import { BlogContext } from '../context/BlogState';

const Blogs = (props) => {
  const {getBlogs, ...blogsState} = useContext(BlogContext);
  const [loadingStatus, setloadingStatus] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if(!localStorage.getItem('user')){
      history.push('/login');
    } else { 
        setloadingStatus(true)
        getBlogs().then((blogs) => {
          setloadingStatus(false)
        })
    }
  }, [localStorage.getItem('user')]);

  const logout = () => {
    localStorage.clear();
  }

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hours: 'numeric', minutes: 'numeric'};


  return (
    
    <div className="App">
      <header className="header_new py-2 position-relative">
      <nav
        className="navbar navbar-light navbar-expand-md bg-faded justify-content-center"
      >
        <div className="container d-flex mobile-grid gap-2">
          <a href="/" className="navbar-brand text-center"
            ><img src="./images/logo.svg" className="nav-logo" alt="Logo" /></a
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
            <a href="" onClick={() => logout()} title="">Log Out</a>
          </div>
        </div>
      </nav>
    </header>
      <div className="container blogscontainer">


      {loadingStatus && <div className="loaderContainer"><div className="spinner-border text-primary mx-auto" role="status">
            <span class="sr-only">Loading...</span>
          </div></div>  || 

      <Table>
        <thead>
          <tr>
            <th>Blog Title</th>
            <th>Creator</th>
            <th>Creation Date</th>
            <th>Visibility</th>
          </tr>
        </thead>
        <tbody>
            {blogsState.blogs.blogs && blogsState.blogs.blogs.map((blog, index) => {
                return <tr key={index}>
                    <td><a href={`/blog/${blog._id}`} className="btn btn-primary">{blog.title}</a></td>
                    <td>{blog.creator}</td>
                    <td>{new Date(blog.creationDate).toLocaleDateString("en-US", dateOptions)}</td>
                    <td>{blog.visibility ? "Visible" : "Not visible"}</td>
                </tr>
            })}
          
        </tbody>
      </Table>
    }
      </div>


      <footer className="footer-main footer shadow-lg">
      <a href="#" title="" className="bottom-to-top-btn"
        ><i className="fas fa-chevron-up"></i><span>TOP</span></a
      >
      <div
        className="container d-flex justify-content-between align-items-center flex-column flex-xl-row"
      >
        <figure><img src="./images/logo.svg" alt="logo" className="footer-logo"/></figure>
        
      </div>
    </footer>
    </div>

  )
}



export default Blogs;
