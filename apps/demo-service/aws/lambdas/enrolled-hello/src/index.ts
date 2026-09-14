import type { APIGatewayProxyHandler } from 'aws-lambda';

// scenario ② re-verification (SAV-690): confirms coverage-guard's fixed two-dot
// diff genuinely detects this lambda dir as changed, not a vacuous pass.
export const handler: APIGatewayProxyHandler = async (event) => {
  const name = event.queryStringParameters?.name ?? 'world';
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `hello 2, ${name}` }),
  };
};
