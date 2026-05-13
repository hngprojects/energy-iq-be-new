import { Injectable } from '@nestjs/common';
import { AgentTool } from '../helpers/agent-tool';
import { DynamicStructuredTool, tool } from 'langchain';
import { z } from 'zod';

@Injectable()
export class FixRecommender implements AgentTool {
  create(): DynamicStructuredTool {
    return tool(() => this.recommendFix(), {
      name: 'recommend_fix',
      description: "Recommend a fix for an alert's problem",
      schema: z.object({
        url: z.string().url(),
      }),
    });
  }

  recommendFix() {}
}
