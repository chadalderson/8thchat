import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// Configure OpenAI directly (bypass AI Gateway)
const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openaiProvider('gpt-4o-mini'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openaiProvider('gpt-4.1-mini'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openaiProvider('gpt-4o-mini'),
        'artifact-model': openaiProvider('gpt-4.1-mini'),
      },
    });
