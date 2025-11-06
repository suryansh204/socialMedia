const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  // Use development mode
  mode: 'development', 
  
  // Set entry point to your main ApolloProvider file
  entry: './src/ApolloProvider.js',

  output: {
    // Set output path (usually unnecessary for dev server, but good practice)
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        // Rule for processing JS and JSX files
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      // Rule for processing CSS files (required for semantic-ui-css)
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      // Use your public/index.html as the template
      template: './public/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
        // 1. Standard environment variable
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        
        // 2. CRITICAL: Inject the exact AWS keys used in your file
        'process.env.REACT_APP_AWS_ACCESS_KEY': JSON.stringify(process.env.REACT_APP_AWS_ACCESS_KEY),
        'process.env.REACT_APP_AWS_SECRET_ACCESS_KEY': JSON.stringify(process.env.REACT_APP_AWS_SECRET_ACCESS_KEY),
    }),
  ],

 devServer: {
    // Host fixes we implemented earlier:
    host: '127.0.0.1',
    port: 3002, 
    allowedHosts: 'all',
    open: true,
    historyApiFallback: true,
    
    
    // FIX: Proxy must be an array of objects
    proxy: [
        {
            // Context tells Webpack which paths to proxy. 
            // Setting it to a function that returns true proxies everything 
            // that isn't a static asset (like your React code or CSS).
            context: ['/graphql'], 
            target: 'http://localhost:5001',
            changeOrigin: true,
            secure: false,
        },
    ],
    // Required for routing in single-page apps (like React Router)
     
}
};