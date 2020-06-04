import { FunctionComponent } from 'react';
import classNames from 'classnames/bind';
import styles from './GlobalNavHeader.module.scss';
import React from 'react';

const cx = classNames.bind(styles);

interface Props {

}

const GlobalNavHeader: FunctionComponent<Props> = ({

}) => {

    return (
        <div className={cx('header-gnb')}>
            <div className={cx('header-inner')}>
                global
            </div>
        </div>
    );
}

export default GlobalNavHeader;