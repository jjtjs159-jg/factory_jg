import React, { Component, Fragment } from 'react';
import { Study } from 'pages';
import Test from 'components/Test';
import { BrowserRouter, Route, Link, Switch  } from 'react-router-dom';

interface Props {

}

class Home extends Component<Props> {
    render() {
        return (
            <Fragment>
                커밋 테스트
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/study" component={Study} />
                    </Switch>
                </BrowserRouter>
            </Fragment>
        );
    }
}

export default Home;