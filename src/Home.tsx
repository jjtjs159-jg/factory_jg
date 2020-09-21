import React, { Component, Fragment } from 'react';
import {
    Main,
    Study,
    A11y,
    Tsc,
    Gallery,
} from 'pages';
import { BrowserRouter, Route, Link, Switch  } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

interface Props {

}

class Home extends Component<Props> {
    render() {
        return (
            <Fragment>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Main} />
                        <Route exact path="/study" component={Study} />
                        <Route exact path="/a11y" component={A11y} />
                        <Route exact path="/tsc" component={Tsc} />
                        <Route exact path="/gallery" component={Gallery} />
                    </Switch>
                </BrowserRouter>
            </Fragment>
        );
    }
}

export default Home;