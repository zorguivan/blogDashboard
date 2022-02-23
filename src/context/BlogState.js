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
                return res.data;
            }).catch(() => dispatch({
                type: 'BLOGS_ERROR',
            }))
        return data;
    }

    async function getBlog(id) {
        const data = await axios.get("/api/blogs/" + id)
            .then(res => {
                dispatch({
                    type: 'BLOG_LOADED',
                    payload: res.data
                })
                return res.data;
            }).catch(() => dispatch({
                type: 'BLOGS_ERROR',
            }))
        return data;
    }
    async function uploadFile(formData, id) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const data = await axios.put('/api/upload/' + id, formData, config)
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

    async function saveBlog(formDataa) {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const formData = new FormData()
        formData.append('title', formDataa.title)
        formData.append('description', formDataa.description)
        formData.append('cta', formDataa.cta)
        formData.append('ctaText', formDataa.ctaText)
        formData.append('visibility', formDataa.visibility)
        formData.append('text', formDataa.text)
        var json_arr = JSON.stringify(formDataa.tags);
        formData.append('tags', json_arr)
        if(formDataa.image){
            formData.append('image', formDataa.image)
        }
        const data = await axios.put('/api/blog/' + formDataa._id, formData, config)
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

    async function addBlog(formDataa) {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const formData = new FormData()
        console.log(formDataa)
        formData.append('title', formDataa.title)
        formData.append('description', formDataa.description)
        formData.append('cta', formDataa.cta)
        formData.append('ctaText', formDataa.ctaText)
        formData.append('visibility', formDataa.visibility)
        formData.append('text', formDataa.text)
        formData.append('creator', formDataa.creator)
        formData.append('creatorId', formDataa.creatorId)
        var json_arr = JSON.stringify(formDataa.tags);
        formData.append('tags', json_arr)
        formData.append('image', formDataa.image)
        const data = await axios.post('/api/blog-image', formData, config)
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

    async function removeBlog(_id) {
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

    return (<BlogContext.Provider value={{
        blogs: state,
        getBlogs,
        getBlog,
        uploadFile,
        addBlog,
        saveBlog,
        removeBlog,
        clearError
    }}> {children}
    </BlogContext.Provider>)
}