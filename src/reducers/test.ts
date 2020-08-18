import * as testActions from 'actions/Test';

const defaultState = {
	id: '',
};

export const test = (state = defaultState, action) => {
	const { type, payload } = action;

	switch (type) {
		case testActions.GET:
			return Object.assign({}, state, {
                id: '테스트'
			});
	    default:
	      	return state;
  	}
}
