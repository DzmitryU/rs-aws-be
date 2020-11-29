import type { Serverless } from 'serverless/aws';
import {SOURCE_FOLDER} from "./src/constants";

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
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
      CATALOG_ITEMS_QUEUE_URL: '${cf:product-service-${self:provider.stage}.SQSQueueUrl}',
    },
    stage: 'dev',
    profile: 'personalAccount',
    region: 'eu-west-1',
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: 's3:ListBucket',
      Resource: ['arn:aws:s3:::rs-aws-be']
    }, {
      Effect: 'Allow',
      Action: ['s3:*'],
      Resource: ['arn:aws:s3:::rs-aws-be/*']
    }, {
      Effect: 'Allow',
      Action: 'sqs:*',
      Resource: ['${cf:product-service-${self:provider.stage}.SQSQueueArn}']
    }]
  },
  functions: {
    importProductsFile: {
      handler: 'src/handlers/import-products-file.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            authorizer: {
              name: 'basicAuthorizer',
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'token',
              arn: '${cf:authorization-service-${self:provider.stage}.basicAuthorizerArn}',
            }
          }
        }
      ]
    },
    importFileParser: {
      handler: 'src/handlers/import-file-parser.importFileParser',
      events: [
        {
          s3: {
            bucket: 'rs-aws-be',
            event: 's3:ObjectCreated:*',
            rules: [{
              prefix: `${SOURCE_FOLDER}/`,
              suffix: '.csv'
            }],
            existing: true
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'UNAUTHORIZED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      GatewayResponseAccessDenied: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'ACCESS_DENIED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      GatewayResponseDefault400: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      GatewayResponseDefault500: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_5XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },

    }
  }
}

module.exports = serverlessConfiguration;
