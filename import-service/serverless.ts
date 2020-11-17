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
            cors: true
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
  }
}

module.exports = serverlessConfiguration;
