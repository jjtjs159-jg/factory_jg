import React, { Component, Fragment } from 'react';
import List from './List';

interface Props {
    // Number[];
    items: Array<Number>;
}

interface State {
    turn: boolean;
}

class Tsc extends Component<Props, State> {

    public static defaultProps: Partial<Props> = {
        items: [11, 22, 33],
    }

    constructor(props) {
        super(props);

        this.state = { 
            turn: false,
        };
    }

    render() {
        const { items } = this.props;
        const { turn } = this.state;
        return (
            <Fragment>
                <button onClick={() => this.setState({ turn: !turn })}>
                    클릭
                </button>
                {items.map((item, i) => {
                    return (
                        <div key={i}>
                            {item}
                        </div>
                    );
                })}
                {turn &&
                    <List />
                }
            </Fragment>
        );
    }
}

export default Tsc;