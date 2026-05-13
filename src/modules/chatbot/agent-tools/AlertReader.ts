import { Injectable } from '@nestjs/common';
import { AgentTool } from '../helpers/agent-tool';
import { DynamicStructuredTool, tool } from '@langchain/core/tools';

@Injectable()
export class AlertReader implements AgentTool {
  create(): DynamicStructuredTool {
    return tool(() => this.readAlert(), {
      name: 'read_alert',
      description: 'Extract alert data from Alert entity',
      schema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The URL of the document to fetch.',
            format: 'uri',
          },
        },
        required: ['url'],
      },
    });
  }

  readAlert() {}
}
