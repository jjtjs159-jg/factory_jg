const path = require('path');
const webpack = require("webpack");
const dotenv = require('dotenv');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

dotenv.config({
    path: __dirname + '/.env'
});

module.exports = {
    devServer: {
        inline: true,
        port: 8080,
        historyApiFallback: true
    },
    entry: {
        'js/app': ['./src/App.tsx'],
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/',
    },
    node: {
        fs: "empty",
        global: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.(ts|tsx)$/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.module\.scss$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: "[name]__[local]___[hash:base64:5]",
                                // localIdentName: "[local]",
                            },
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            module: true,
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9',
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        }
                    },
                    {
                        loader: require.resolve('sass-loader'),
                        options: {
                            
                        },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|otf|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),

        new ForkTsCheckerWebpackPlugin({ silent: true }),

        new webpack.DefinePlugin({
            "process.env": {
                "API_URL": JSON.stringify(process.env.API_URL),
            }
        }),

        // new ExtractTextPlugin.extract({
        //     filename: 'common.css',
        // }),

        // new webpack.EnvironmentPlugin([
        //     'NODE_ENV',
        //     'API_URL',
        //     'DEBUG',,
        // ]),

        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        //     'process.env.API_URL': JSON.stringify(process.env.API_URL),
        //     'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
        // }),
    ],
};