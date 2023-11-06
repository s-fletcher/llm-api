import {
  AnthropicBedrockChatApi,
  AnthropicChatApi,
  OpenAIChatApi,
} from './src';

(async function go() {
  let client:
    | OpenAIChatApi
    | AnthropicChatApi
    | AnthropicBedrockChatApi
    | undefined;

  if (process.env.OPENAI_KEY) {
    client = new OpenAIChatApi(
      {
        apiKey: process.env.OPENAI_KEY ?? 'YOUR_client_KEY',
      },
      { contextSize: 4096, model: 'gpt-3.5-turbo-0613' },
    );
  } else if (process.env.ANTHROPIC_KEY) {
    client = new AnthropicChatApi(
      {
        apiKey: process.env.ANTHROPIC_KEY ?? 'YOUR_client_KEY',
      },
      { stream: true, temperature: 0, model: 'claude-2' },
    );
  } else if (
    process.env.AWS_BEDROCK_ACCESS_KEY &&
    process.env.AWS_BEDROCK_SECRET_KEY
  ) {
    client = new AnthropicBedrockChatApi(
      {
        accessKeyId: process.env.AWS_BEDROCK_ACCESS_KEY ?? 'YOUR_access_key',
        secretAccessKey:
          process.env.AWS_BEDROCK_SECRET_KEY ?? 'YOUR_secret_key',
      },
      { stream: false, temperature: 0, model: 'anthropic.claude-v2' },
    );
  }

  const res0 = await client?.textCompletion('Hello', {
    systemMessage: 'You will respond to all human messages in JSON',
    responsePrefix: '{ "message": "',
  });
  console.info('Response 0: ', res0);

  const resEm = await client?.textCompletion('✨');
  console.info('Response em: ', resEm);

  const res1 = await client?.textCompletion('Hello', {
    maximumResponseTokens: 1,
  });
  console.info('Response 1: ', res1);

  const res2 = await client?.chatCompletion([
    { role: 'user', content: 'hello' },
    {
      role: 'assistant',
      content: '',
      function_call: {
        name: 'print',
        arguments: '{"hello": "world"}',
      },
    },
  ]);
  console.info('Response 2: ', res2);

  const res3 = await res2?.respond({ role: 'user', content: 'testing 123' });
  console.info('Response 3: ', res3);
})();
