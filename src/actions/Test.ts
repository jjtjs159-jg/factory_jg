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

// saga용 이벤트. saga에서는 이벤트가 saga를 거치기 때문에 대응시키는데
// 이벤트, 이벤트 성공, 실패 총 3개를 만든다.
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