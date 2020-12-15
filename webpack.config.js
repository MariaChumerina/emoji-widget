const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 8000,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [ "autoprefixer" ],
                                ],
                            },
                        },
                    },
                    'stylus-loader'
                ],
            },
            {
                test: /\.(png|jpg|svg)$/i,
                exclude: [
                    path.resolve(__dirname, 'src/images/categories')
                ],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.(svg)$/i,
                include: [
                    path.resolve(__dirname, 'src/images/categories')
                ],
                use: 'svg-inline-loader',
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index_bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: 'Emoji Widget',
            favicon: './src/images/favicon.ico'
        }),
    ],
};
