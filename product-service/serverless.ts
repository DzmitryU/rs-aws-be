import type {Serverless} from 'serverless/aws';

const serverlessConfiguration: Serverless = {
    service: {
        name: 'product-service',
    },
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true
        }
    },
    // Add the serverless-webpack plugin
    plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
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
                        cors: true
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
                        cors: true
                    }
                }
            ]
        },
        createProduct: {
            handler: 'src/handlers/create-product.createProduct',
            events: [
                {
                    http: {
                        method: 'post',
                        path: 'products',
                        cors: true
                    }
                }
            ]
        }
    }
}

module.exports = serverlessConfiguration;
