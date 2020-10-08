// import { call, spawn, put, takeLatest, takeEvery } from 'redux-saga/effects';
// // import {
// //     auth as authRoutine,
// // } from '../routines';
// import * as testActions from 'actions/Test';
// import requestApi from 'api/requestApi';

// function* auth({ payload }: any) {
//     try {
//         yield put(testActions.authRequest());
//         console.log('zzzzzzz')
//         const result = yield requestApi({
//             method: 'GET',
//             version: 'v1',
//             url: '/',
//         }).then((res) => {
//             console.log(res)
//         }).catch((e) => {
//             throw e;
//         });

//         yield put(testActions.authSuccess(result));
//     } catch (error) {
//         yield put(testActions.authFail(error));
//     }

//     // yield put(authRoutine.fulfill());
// }
// export function* watchUser() {
//     yield takeEvery(testActions.AUTH, auth);
// }
