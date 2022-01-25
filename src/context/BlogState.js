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

        const saveBlog =  (formData) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            axios.put('/api/blog/' + formData._id, formData, config)
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
        }

        const addBlog = (formData) => {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                axios.post('/api/blog', formData, config)
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
            }

            
        function clearError() {
            dispatch({
                type: 'CLEAR_ERROR',
            })
        }

        return ( <BlogContext.Provider value={{
                    blogs: state,
                    getBlogs,
                    getBlog,
                    uploadFile,
                    addBlog,
                    saveBlog,
                    clearError
                }}> { children } 
                </BlogContext.Provider>)
        }