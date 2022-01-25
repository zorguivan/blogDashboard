import React, { createContext, useReducer } from 'react';
import AuthReducer from '../Reducer/AuthReducer';
import axios from 'axios'

const initialState = {
    isAuthenticated: null,
    user: null,
    error: null
}

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
        const [state, dispatch] = useReducer(AuthReducer, initialState);

        async function getUserInfo (id) {
            console.log('Requesting user')
            const data = await axios.get(`/api/user/info/${id}`)
                .then(res => {
                    dispatch({
                        type: 'USERINFO_LOADED',
                        payload: res.data
                    });
                    console.log(res.data)
                    return res.data;
                }).catch(err => {
                    dispatch({
                        type: 'USERINFO_ERROR',
                        payload: err,
                    });
                    return res.err;

                });
                return data;
        }
        

        async function checkStatus(id) {
            const data = await axios.get(`/api/checkStatus/${id}`)
                .then(res => {
                    dispatch({
                        type: 'STATUS_LOADED',
                        payload: res.data
                    });
                    console.log(res.data);
                    return res.data;
                }).catch(err => {
                    dispatch({
                        type: 'STATUS_ERROR',
                        payload: err,
                    });
                    return res.err;

                });
                return data;
        }

        async function loadUser(id) {
            const data = await axios.get("/api/user/info")
                .then(res => {
                    dispatch({
                        type: 'USER_LOADED',
                        payload: res.data
                    })
                    return  res.data;
                }).catch(() => dispatch({
                    type: 'AUTH_ERROR',
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

        const register = (formData) => {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                axios.post('/api/user', formData, config)
                    .then(res => {
                        dispatch({
                            type: 'REGISTER_SUCCESS',
                            payload: res.data
                        });
                        loadUser();
                    }).catch(err => {
                        dispatch({
                            type: 'REGISTER_FAIL',
                            payload: err,
                        });
                    });
            }

            


            const updateUser = (formData) => {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                axios.put(`/api/user/${formData._id}`, formData, config)
                    .then(res => {
                        dispatch({
                            type: 'USERUPDATE_SUCCESS',
                            payload: formData
                        });
                        console.log(formData)
                    }).catch(err => {
                        dispatch({
                            type: 'USERUPDATE_FAIL',
                            payload: err,
                        });
                    });
            }
            // Login User
        const login = (formData) => {
                console.log(formData)
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                axios.post('/api/auth', formData, config)
                    .then(res => {
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            payload: res.data
                        })
                    }).catch(err => {
                        dispatch({
                            type: 'LOGIN_FAIL',
                            payload: err
                        })
                    });
            }
            // Logout User
        function logout() {
            dispatch({
                type: 'LOGOUT'
            })
        }
        // Clear Errors
        function clearError() {
            dispatch({
                type: 'CLEAR_ERROR',
            })
        }

        return ( <AuthContext.Provider value={{
                    auth: state,
                    loadUser,
                    uploadFile,
                    checkStatus,
                    register,
                    login,
                    updateUser,
                    getUserInfo,
                    logout,
                    clearError
                }}> { children } 
                </AuthContext.Provider>)
        }