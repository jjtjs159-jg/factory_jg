import React, { Component } from 'react';

interface Props {

}

interface State {
    date: any;
}

class Clock extends Component<Props, State> {
    timerID: NodeJS.Timeout;

    constructor(props: Props) {
        super(props);
    
        this.state = {
            date: new Date(),
        };
    }

    componentDidMount() {
        // 1초 간격으로 tick() 실행
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        // 이전에 실행된 작업을 제거
        clearInterval(this.timerID);
    }

    tick = () => {
        this.setState({
            date: new Date()
        });
    }

    render() {
        console.log('render')
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        );
    }
}

export default Clock;