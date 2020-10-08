import { all } from 'redux-saga/effects';
import { routinePromiseWatcherSaga } from 'redux-saga-routines';
// import { watchUser } from './user';

// export default function* rootSaga() {
//     yield all([
//         watchUser(),
//         routinePromiseWatcherSaga(),
//     ]);
// }


import { call, spawn, put, takeEvery } from "redux-saga/effects";
import { AUTH_REQUEST, authRequest, authFail, authSuccess} from "../actions/Test";
import requestApi from 'api/requestApi';

// 콜백
function* fetchCallData() {
    try {
        // yield put(authRequest());
        console.log('zzzzzzz')
        const result = yield requestApi({
            method: 'GET',
            version: 'v1',
            url: '/',
        }).then((res) => {
            return res;
        }).catch((e) => {
            throw e;
        });
        yield put(authSuccess(result));
    } catch (error) {
        yield put(authFail(error))
    }
}

// 이벤트 감시자
function* watchCall() {
    // AUTH_REQUEST로 받는 모든 이벤트를 받아 콜백 실행
    yield takeEvery(AUTH_REQUEST, fetchCallData);
}

export default function* root() {
    yield spawn(watchCall);
}