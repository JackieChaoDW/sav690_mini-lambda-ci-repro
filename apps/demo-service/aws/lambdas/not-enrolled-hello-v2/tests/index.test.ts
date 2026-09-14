import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../src/index';

describe('not-enrolled-hello-v2 handler', () => {
  it('greets the given name', async () => {
    const event = { queryStringParameters: { name: 'SAV-690' } } as unknown as APIGatewayProxyEvent;
    const result: any = await handler(event, {} as Context, () => undefined);
    expect(JSON.parse(result.body).message).toBe('hello (not enrolled v2), SAV-690');
  });
});
