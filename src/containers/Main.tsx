import React, { FunctionComponent, useEffect, useState, Fragment } from 'react';
import * as testActions from 'actions/Test';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { GlobalNavHeader } from 'components/Headers';
import { requestApi } from 'api';
import classNames from 'classnames/bind';
import styles from './Main.module.scss';

const cx = classNames.bind(styles);

interface ABCProps {
    loaded: boolean;
    data: any;
}

const ABC: FunctionComponent<ABCProps> = ({
    data,
    loaded,
}) => {

    if (!loaded) {
        return (
            <div>
                ...loading
            </div>
        );
    }

    return (
        <div>
            {data.name}
        </div>
    );
};

interface Props {
    dispatch: Dispatch;
}

interface State {
    loaded: boolean;
    data: any;
}

/**
 * Route: /
 */
const Main: FunctionComponent<Props> = ({
    dispatch,
}) => {

    // const handleTest = () => {
    //     dispatch(testActions.getTest());
    // };

    useEffect(() => {
        dispatch(testActions.authRequest());
    }, []);

    // const [state, setState] = useState<State>({
    //     loaded: false,
    //     data: {},
    // });

    // const test = async () => {
    //     const result = await requestApi({
    //         url: '/',
    //     }).then((res: any) => {
    //         return res;
    //     }).catch((error: any) => {
    //         throw error;
    //     });

    //     return result;
    // };

    // useEffect(() => {
    //     test().then((res: any) => {
    //         setState({
    //             loaded: true,
    //             data: res,
    //         });
    //         return res;
    //     }).catch((error: any) => {
    //         throw error;
    //     });
    // }, []);

    return (
        <div>
            {/* <GlobalNavHeader /> */}
            <div className={cx('container')}>
                {/* <ABC loaded={state.loaded} data={state.data} /> */}
                {/* <button onClick={handleTest}>
                    버튼
                </button> */}
                {/* {state.data.name} */}
                메인
            </div>
        </div>
    );
}

const mapStateToProps = (state: any) => {
    return {
        test: state.test,
    };
};

export default connect(mapStateToProps)(Main);