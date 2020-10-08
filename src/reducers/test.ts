import * as testActions from 'actions/Test';

const defaultState = {
    name: '',
    error: false,
};

export const test = (state = defaultState, action) => {
    const { type, payload } = action;
    console.log('action')
    console.log(action)
	switch (type) {

        //============================
        case testActions.AUTH_REQUEST:
            return Object.assign({}, state, {});
        case testActions.AUTH_SUCCESS:
            return Object.assign({}, state, {
                ...state,
                name: action.data.name,
                error: false,
            });
        case testActions.AUTH_FAILURE:
            return Object.assign({}, state, {
                error: true,
			});

        default:
            return state;
    }
}
