import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../src/index';

describe('enrolled-hello handler', () => {
  it('greets the given name', async () => {
    const event = { queryStringParameters: { name: 'SAV-690' } } as unknown as APIGatewayProxyEvent;
    const result: any = await handler(event, {} as Context, () => undefined);
    expect(JSON.parse(result.body).message).toBe('hello, SAV-690');
  });

  it('defaults to world when no name is given', async () => {
    const event = { queryStringParameters: null } as unknown as APIGatewayProxyEvent;
    const result: any = await handler(event, {} as Context, () => undefined);
    expect(JSON.parse(result.body).message).toBe('hello, world');
  });
});
