import React, { FunctionComponent } from 'react';
import { GlobalNavHeader } from 'components/Headers';
import classNames from 'classnames/bind';
import styles from './Main.module.scss';

const cx = classNames.bind(styles);

/**
 * Route: /
 */
const Main: FunctionComponent = () => {

    return (
        <div>
            <GlobalNavHeader />
            <div className={cx('container')}>
                sdgds
            </div>
        </div>
    );
}

export default Main;