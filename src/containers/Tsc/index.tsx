import React, { Component, Fragment } from 'react';
import List from './List';
interface Props {
    // Number[];
    items: Array<Number>;
    test?: [string, number];
}

enum Color {
    Red = 1,
    Green,
    Blue,
}

interface State {
    turn: boolean;
}

class Tsc extends Component<Props, State> {

    public static defaultProps: Partial<Props> = {
        items: [11, 22, 33],
        test: ['ab', 123]
    }

    constructor(props) {
        super(props);

        this.state = { 
            turn: false,
        };
    }

    render() {
        let colorName = Color[2];
        let colorName2 = Color.Green;
        console.log(colorName);
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