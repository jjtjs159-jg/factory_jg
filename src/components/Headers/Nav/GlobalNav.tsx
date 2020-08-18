import React, { FunctionComponent } from 'react';
import { BrowserRouter, Route, Link, Switch  } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './GlobalNav.module.scss';

const cx = classNames.bind(styles);

interface Props {

}

const GlobalNav: FunctionComponent<Props> = ({

}) => {

    const items = [
        {
            key: 'career',
            link: '/study',
        },
        {
            key: 'project',
            link: '/study',
        },
        {
            key: 'skills',
            link: '/study',
        },
    ];

    const handleClick = (to: string) => {

    };

    return (
        <div className={cx('wrap')}>
            {items.map((item, i) => {
                return (
                    <Link to={item.link} className={cx('item')} key={item.key}>
                        {item.key}
                    </Link>
                );
            })}
        </div>
    )
}

export default GlobalNav;