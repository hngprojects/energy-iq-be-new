import { DynamicStructuredTool } from 'langchain';

export interface AgentTool {
  create(): DynamicStructuredTool;
}
