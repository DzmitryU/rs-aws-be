import type {Serverless} from 'serverless/aws';

const batchSize = 5;

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
            TOPIC_ARN: {
                Ref: 'SNSTopic'
            }
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [
                    'sqs:ReceiveMessage'
                ],
                Resource: [
                    {
                        'Fn::GetAtt': [ 'SQSQueue', 'Arn' ]
                    }
                ]
            },
            {
                Effect: 'Allow',
                Action: 'sns:*',
                Resource: {
                    Ref: 'SNSTopic'
                }
            }
        ],
        stage: 'dev',
        profile: 'personalAccount',
        region: '${env:REGION}'
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
        },
        catalogBatchProcess: {
            handler: 'src/handlers/catalog-batch-process.catalogBatchProcess',
            events: [
                {
                    sqs: {
                        batchSize,
                        arn: {
                            'Fn::GetAtt': [
                                'SQSQueue', 'Arn'
                            ]
                        }
                    }
                }
            ],
        }
    },
    resources: {
        Resources: {
            SQSQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'CatalogItemsQueue'
                }
            },
            SNSTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'createProductTopic',
                }
            },
            SNSSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: '${env:MAIN_EMAIL}',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'SNSTopic'
                    },
                    FilterPolicy: {
                        ProductsNumber: [{ numeric: ['<', batchSize] }]
                    }
                },
            },
            AdditionalSNSSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: '${env:ADDITIONAL_EMAIL}',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'SNSTopic'
                    },
                    FilterPolicy: {
                        ProductsNumber: [{ numeric: ['>=', batchSize] }]
                    }
                },
            },
        },
        Outputs: {
            SQSQueueUrl: {
                Value: {
                    Ref: 'SQSQueue'
                }
            },
            SQSQueueArn: {
                Value: {
                    'Fn::GetAtt': [ 'SQSQueue', 'Arn' ]
                }
            }
        }
    }
}

module.exports = serverlessConfiguration;
