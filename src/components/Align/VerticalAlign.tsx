import React, { FunctionComponent } from 'react';
import classNames from 'classnames/bind';
import styles from './VerticalAlign.module.scss';

const cx = classNames.bind(styles);

interface Props {
    fullsize?: boolean;
}

const VerticalAlign: FunctionComponent<Props> = ({
    fullsize,
    children,
}) => {

    const classes = cx(
        'align-vertical',
        {
            fullsize,
        },
    );

    return (
        <div className={classes}>
            <div className={cx('align-vertical-inner')}>
                {children}
            </div>
        </div>
    );
};

export default VerticalAlign;