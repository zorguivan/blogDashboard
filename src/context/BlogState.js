import React, { createContext, useReducer } from 'react';
import BlogReducer from '../Reducer/BlogReducer';
import axios from 'axios'

const initialState = {
    blogs: null,
    error: null
}

export const BlogContext = createContext(initialState);

export const BlogProvider = ({ children }) => {
        const [state, dispatch] = useReducer(BlogReducer, initialState);

        async function getBlogs() {
            const data = await axios.get("/api/blogs")
                .then(res => {
                    dispatch({
                        type: 'BLOGS_LOADED',
                        payload: res.data
                    })
                    return  res.data;
                }).catch(() => dispatch({
                    type: 'BLOGS_ERROR',
                }))
                return data;
        }
        
        async function getBlog(id){
            const data = await axios.get("/api/blogs/" + id)
                .then(res => {
                    dispatch({
                        type: 'BLOG_LOADED',
                        payload: res.data
                    })
                    return  res.data;
                }).catch(() => dispatch({
                    type: 'BLOGS_ERROR',
                }))
                return data;
        }
        async function uploadFile(formData, id){
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const data = await axios.put('/api/upload/' +  id, formData, config)
                .then(res => {
                    dispatch({
                        type: 'UPLOAD_SUCCESS',
                        payload: res.data
                    });
                    getUserInfo(id)
                    return res;
                }).catch(err => {
                    dispatch({
                        type: 'UPLOAD_FAIL',
                        payload: err,
                    });
                });
                return data;

        }

        async function saveBlog (formData){
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const data = await axios.put('/api/blog/' + formData._id, formData, config)
                .then(res => {
                    dispatch({
                        type: 'BLOGSAVE_SUCCESS',
                        payload: res.data
                    });
                    getBlogs();
                }).catch(err => {
                    dispatch({
                        type: 'BLOGSAVE_FAIL',
                        payload: err,
                    });
                });
                return data;

        }

        async function addBlog (formData) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const data = await axios.post('/api/blog', formData, config)
                    .then(res => {
                        dispatch({
                            type: 'BLOGSAVE_SUCCESS',
                            payload: res.data
                        });
                        getBlogs();
                    }).catch(err => {
                        dispatch({
                            type: 'BLOGSAVE_FAIL',
                            payload: err,
                        });
                    });
                return data;
            }

            
        function clearError() {
            dispatch({
                type: 'CLEAR_ERROR',
            })
        }

        async function removeBlog (_id) {
            const data = await axios.delete(`/api/blog/${_id}`)
                .then(res => {
                    dispatch({
                        type: 'BLOGDELETE_SUCCESS',
                        payload: _id
                    });
                        getBlogs();
                }).catch(err => {
                    dispatch({
                    type: 'BLOGDELETE_FAIL',
                    payload: err,
                });
            });
            return data;

        }

        return ( <BlogContext.Provider value={{
                    blogs: state,
                    getBlogs,
                    getBlog,
                    uploadFile,
                    addBlog,
                    saveBlog,
                    removeBlog,
                    clearError
                }}> { children } 
                </BlogContext.Provider>)
        }