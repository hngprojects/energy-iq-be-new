import { Injectable } from '@nestjs/common';
import { AgentTool } from '../helpers/agent-tool';
import { DynamicStructuredTool, tool } from 'langchain';
import { z } from 'zod';

@Injectable()
export class LanguageDetector implements AgentTool {
  create(): DynamicStructuredTool {
    return tool(() => this.detectLanguage(), {
      name: 'detect_language',
      description: 'Detect the language of the user message',
      schema: z.object({
        url: z.string().url(),
      }),
    });
  }

  detectLanguage() {}
}
