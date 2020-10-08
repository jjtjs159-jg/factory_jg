import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import createSagaMiddleware, { END } from 'redux-saga';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

// 미들웨어에 사가를 등록하고, 실행시킨다.
export function configureStore() {
    const store = createStore(
        rootReducer,
        compose(
            applyMiddleware(sagaMiddleware),
        )
    );

    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END);

    return store;
}