export const GET = 'GET_TEST';
export const GET_REQUEST = GET+'_REQUEST';
export const GET_SUCCESS = GET+'_SUCCESS';
export const GET_FAILURE = GET+'_FAILURE';

export const getTest = () => {  
    return { 
    	type: GET, 
    	// promise : { 
        //     method : 'GET',
        //     version : 'v1',
        //     url : '/test'
        // }
    };
}