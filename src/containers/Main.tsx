import React, { FunctionComponent } from 'react';
import * as testActions from 'actions/Test';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { GlobalNavHeader } from 'components/Headers';
import classNames from 'classnames/bind';
import styles from './Main.module.scss';

const cx = classNames.bind(styles);

interface Props {
    dispatch: Dispatch;
}

/**
 * Route: /
 */
const Main: FunctionComponent<Props> = ({
    dispatch,
}) => {

    const handleTest = () => {
        dispatch(testActions.getTest());
    };

    return (
        <div>
            <GlobalNavHeader />
            <div className={cx('container')}>
                <button onClick={handleTest}>
                    버튼
                </button>
            </div>
        </div>
    );
}

const mapStateToProps = (state: any) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(Main);