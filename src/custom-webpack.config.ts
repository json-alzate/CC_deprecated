import * as CompressionPlugin from 'compression-webpack-plugin';
import * as BrotliPlugin from 'brotli-webpack-plugin';

module.exports = {
    plugins: [
        new CompressionPlugin({
            algorithm: 'gzip',
        }),
        new BrotliPlugin(),
    ],
};
