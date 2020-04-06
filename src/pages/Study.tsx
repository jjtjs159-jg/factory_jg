import React, { Component } from 'react';
import { find } from 'lodash';
import classNames from 'classnames/bind';
import styles from './Study.module.scss';

const cx = classNames.bind(styles);

interface Props {

}

class Study extends Component<Props> {

    render() {
        return (
            <div className={cx('box')}>
                <br/>mkdir jg-react-app
                <br/>cd ./jg-react-app
                <br/>yarn init -y

                <br/>yarn add --save react react-dom
                <br/>yarn add --save-dev webpack webpack-cli html-webpack-plugin webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react rimraf

                <br/>package.json 설정

                <br/>webpack.config.js 설정

                <br/>.babelrc 설정
                
                <br/> index.html 생성

                <br/>React App.js 생성

                <br/>Typescript 세팅

                <br/>yarn add --save-dev typescript @babel/preset-typescript ts-loader fork-ts-checker-webpack-plugin tslint tslint-react

                <br/>webpack에 typescript 설정 추가

                <br/>tsconfig.json 생성
                <br/>tslint.json 생성

                <br/>
                root import 추가
                <br/>yarn add babel-plugin-root-import

                .babelrc에
                <br/>
                plugin babel-plugin-root-import ~~ 추가
                혹은 module-resolver로 해도됨
                <br/>
                webpack.config.js에 <br/>
                resolve extensions 추가<br/>

                tsconfig.json에<br/>
                compilerOptions에<br/>
                baseUrl, paths 추가

            </div>
        );
    }
}

export default Study;