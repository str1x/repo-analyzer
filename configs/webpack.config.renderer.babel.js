/* eslint-disable no-console */
/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import { spawn } from 'child_process';
import TerserPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.config.base';

const isDev = process.env.NODE_ENV === 'development';
const devPort = process.env.PORT || 1212;
const devPublicPath = `http://localhost:${devPort}/dist`;

export default merge.smart(baseConfig, {
    devtool: 'source-map',

    mode: isDev ? 'development' : 'production',

    target: 'electron-preload',

    entry: [
        ...isDev ? [
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://localhost:${devPort}/`,
            'webpack/hot/only-dev-server',
        ] : [],
        path.join(__dirname, '..', 'app/index.jsx'),
    ],

    output: {
        path: path.join(__dirname, '..', 'app/dist'),
        publicPath: './dist/',
        filename: 'renderer.build.js',
    },

    resolve: {
        alias: {
            ...isDev ? {
                'react-dom': '@hot-loader/react-dom',
            } : {},
            app: path.join(__dirname, '..', 'app'),
        },
    },

    module: {
        rules: [
            // Common Image Formats
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                use: 'url-loader',
            },
        ],
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                sourceMap: true,
                cache: true,
            }),
        ],
    },

    plugins: [
        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behaviour between development builds and
         * release builds
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks
         */
        new webpack.EnvironmentPlugin({
            NODE_ENV: isDev ? 'development' : 'production',
        }),

        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            openAnalyzer: false,
        }),

        ...isDev ? [
            new webpack.HotModuleReplacementPlugin({
                multiStep: true,
            }),
        ] : [],
    ],

    devServer: {
        port: devPort,
        publicPath: devPublicPath,
        compress: true,
        noInfo: false,
        stats: 'errors-only',
        inline: true,
        lazy: false,
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentBase: path.join(__dirname, 'dist'),
        watchOptions: {
            aggregateTimeout: 300,
            ignored: /node_modules/,
            poll: 100,
        },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false,
        },
        before() {
            console.log('Starting Main Process...');
            spawn('npm', ['run', 'start-main-dev'], {
                shell: true,
                env: process.env,
                stdio: 'inherit',
            })
                .on('close', (code) => process.exit(code))
                .on('error', (spawnError) => console.error(spawnError));
        },
    },
});
