export const AUTH = 'AUTH';
export const AUTH_REQUEST = AUTH+'_REQUEST';
export const AUTH_SUCCESS = AUTH+'_SUCCESS';
export const AUTH_FAILURE = AUTH+'_FAILURE';

// export const getTest = () => {  
//     return { 
//     	type: AUTH, 
//     	promise : { 
//             method : 'GET',
//             version : 'v1',
//             url : '/'
//         }
//     };
// }

export const authRequest = () => {
    return {
        type: AUTH_REQUEST
    }
};

export const authSuccess = (data: any) => {
    return {
        type: AUTH_SUCCESS,
        data
    }
};

export const authFail = (data: any) => {
    return {
        type: AUTH_FAILURE,
        data,
    }
};