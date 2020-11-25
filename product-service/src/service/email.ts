import AWS from "aws-sdk";

const sns = new AWS.SNS({ region: process.env.REGION });

export const send = async (ids: string[]) => {
    return sns.publish({
        Subject: 'New products import',
        Message: `${ids.length}: ${JSON.stringify(ids)}`,
        TopicArn: process.env.TOPIC_ARN,
        MessageAttributes: {
            ProductsNumber: {
                DataType: 'Number',
                StringValue: JSON.stringify(ids.length),
            },
        },
    }).promise();
}