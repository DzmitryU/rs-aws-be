import type {Serverless} from 'serverless/aws';

const serverlessConfiguration: Serverless = {
    service: {
        name: 'product-service',
        // app and org for use with dashboard.serverless.com
        // app: your-app-name,
        // org: your-org-name,
    },
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true
        }
    },
    // Add the serverless-webpack plugin
    plugins: ['serverless-webpack'],
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',
        apiGateway: {
            minimumCompressionSize: 1024,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
        stage: 'dev',
        profile: 'personalAccount',
        region: 'eu-west-1'
    },
    functions: {
        getProductsList: {
            handler: 'src/handlers/products-list.getProductsList',
            events: [
                {
                    http: {
                        method: 'get',
                        path: 'products',
                    }
                }
            ]
        },
        getProductsById: {
            handler: 'src/handlers/product-by-id.getProductsById',
            events: [
                {
                    http: {
                        method: 'get',
                        path: 'products/{productId}',
                    }
                }
            ]
        }
    }
}

module.exports = serverlessConfiguration;
