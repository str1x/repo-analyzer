import path from 'path';
import webpack from 'webpack';

export default {
    mode: 'development',

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
        ],
    },

    output: {
        path: path.join(__dirname, '..', 'app'),
        // https://github.com/webpack/webpack/issues/1114
        libraryTarget: 'commonjs2',
    },

    /**
     * Determine the array of extensions that should be used to resolve modules.
     */
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [path.join(__dirname, '..', 'app'), 'node_modules'],
    },

    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
        }),

        new webpack.NamedModulesPlugin(),
    ],
};
