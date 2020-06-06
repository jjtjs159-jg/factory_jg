import React, { FunctionComponent, useEffect, useState, Fragment } from 'react';
import { GlobalNavHeader } from 'components/Headers';
import { requestApi } from 'api';
import classNames from 'classnames/bind';
import styles from './Main.module.scss';

const cx = classNames.bind(styles);

interface Props {
    loaded: boolean;
    data: any;
}

const Test: FunctionComponent<Props> = ({
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

/**
 * Route: /
 */
const Main: FunctionComponent = () => {

    const [state, setState] = useState({
        loaded: false,
        data: {},
    });

    const test = async () => {
        const result = await requestApi({
            url: '/',
        }).then((res: any) => {
            return res;
        }).catch((error: any) => {
            throw error;
        });

        return result;
    };

    useEffect(() => {
        test().then((res: any) => {
            setState({
                loaded: true,
                data: res,
            });
            return res;
        }).catch((error: any) => {
            throw error;
        });
    }, []);

    return (
        <div>
            <GlobalNavHeader />
            <div className={cx('container')}>
                <Test loaded={state.loaded} data={state.data} />
            </div>
        </div>
    );
}

export default Main;