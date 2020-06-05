import React, { FunctionComponent } from 'react';
import { VerticalAlign } from 'components/Align';
import classNames from 'classnames/bind';
import styles from './GlobalNavHeader.module.scss';

const cx = classNames.bind(styles);

interface Props {

}

const GlobalNavHeader: FunctionComponent<Props> = ({

}) => {

    return (
        <div className={cx('header-gnb')}>
            <div className={cx('header-inner')}>
                <VerticalAlign fullsize>
                    <div className={cx('left')}>
                        JG Frontend
                    </div>
                    <div className={cx('center')}>
                        Nav
                    </div>
                    <div className={cx('right')}>
                        Menu
                    </div>
                </VerticalAlign>
            </div>
        </div>
    );
}

export default GlobalNavHeader;