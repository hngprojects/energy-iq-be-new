import { Injectable } from '@nestjs/common';
import { AgentTool } from '../helpers/agent-tool';
import { DynamicStructuredTool, tool } from 'langchain';
import { z } from 'zod';

@Injectable()
export class AlertSummarizer implements AgentTool {
  create(): DynamicStructuredTool {
    return tool(() => this.summarizeAlert(), {
      name: 'summarize_alert',
      description: 'Generate a human-friendly message with the alert details',
      schema: z.object({
        url: z.string().url(),
      }),
    });
  }

  summarizeAlert() {}
}
