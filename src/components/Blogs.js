import React, {useState, useContext, useEffect} from 'react';
import { useHistory } from "react-router-dom"
import { Table, Button } from 'reactstrap';

import { BlogContext } from '../context/BlogState';

const Blogs = (props) => {
  const {getBlogs, ...blogsState} = useContext(BlogContext);
  const history = useHistory();

  useEffect(() => {
    if(!localStorage.getItem('user')){
      history.push('/login');
    } else { 
        getBlogs()
    }
  }, [localStorage.getItem('user')]);

  console.log(blogsState)
  return (
    
    <div className="App">
      <header className="App-header">
        Blogs List
      </header>
      <div className="container">


      <Table>
        <thead>
          <tr>
            <th>Blog Title</th>
            <th>Creator</th>
            <th>Creation Date</th>
          </tr>
        </thead>
        <tbody>
            {blogsState.blogs.blogs && blogsState.blogs.blogs.map((blog, index) => {
                return <tr key={index}>
                    <td><a href={`/blog/${blog._id}`} className="btn btn-primary">{blog.title}</a></td>
                    <td>{blog.creator}</td>
                    <td>{blog.creationDate}</td>
                </tr>
            })}
          
        </tbody>
      </Table>

      </div>
    </div>

  )
}



export default Blogs;
