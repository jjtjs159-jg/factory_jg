import React, { Component } from 'react';
import Study from 'pages/Study';
import Test from 'components/Test';

interface Props {

}

class Home extends Component<Props> {
    render() {
        return (
            <>
                <Study />
                <Test />
            </>
        );
    }
}

export default Home;