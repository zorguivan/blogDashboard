export default (state, action) => {
    console.log(action.type);
    console.log(action.payload);
    switch (action.type) {
        case 'USERUPDATE_SUCCESS':
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                error: null
            };
        case 'USERS_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                users: action.payload,
            };
        case 'USERINFO_LOADED':
            return {
                ...state,
                user: action.payload,
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            localStorage.clear();
            localStorage.setItem('user', action.payload.user._id)
            localStorage.setItem('name', action.payload.user.name)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true
            };
        case 'LOGOUT':
        case 'LOGIN_FAIL':
        case 'AUTH_ERROR':
        case 'REGISTER_FAIL':
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                error: action.payload,
                user: null
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };
        default:
            return state
    }
}