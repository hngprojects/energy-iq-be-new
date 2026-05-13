import { Inject, Injectable } from '@nestjs/common';
import { ChatGroq } from '@langchain/groq';
import { createDeepAgent, type DeepAgent } from 'deepagents';
import { type ConfigType } from '@nestjs/config';
import { chatbotConfig } from '../../config/chatbot.config';
import { SYSTEM_PROMPT } from './helpers/prompts';
import { Message } from './entities/message.entity';
import { SYSTEM_SENDER_ID } from './helpers/constants';
import { AIMessage, HumanMessage } from 'langchain';
import { AlertReader } from './agent-tools/AlertReader';
import { AlertSummarizer } from './agent-tools/AlertSummarizer';
import { FixRecommender } from './agent-tools/FixRecommender';
import { LanguageDetector } from './agent-tools/LanguageDetector';

@Injectable()
export class LLMService {
  private readonly agent!: DeepAgent;

  constructor(
    private readonly alertReader: AlertReader,
    private readonly alertSummarizer: AlertSummarizer,
    @Inject(chatbotConfig.KEY) chatBotCfg: ConfigType<typeof chatbotConfig>,
    private readonly fixRecommender: FixRecommender,
    private readonly languageDetector: LanguageDetector,
  ) {
    this.agent = createDeepAgent({
      model: new ChatGroq({
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
        timeout: 30_000,
        maxTokens: 2048,
        apiKey: chatBotCfg.groqApiKey,
      }),
      tools: [
        languageDetector.create(),
        alertReader.create(),
        alertSummarizer.create(),
        fixRecommender.create(),
      ],
      systemPrompt: SYSTEM_PROMPT,
      name: chatBotCfg.chatbotName,
    });
  }

  async invoke(messages: Message[]) {
    console.log('inside invoke function');
    const agentMessages = messages.map((msg) => {
      if (msg.senderId === SYSTEM_SENDER_ID) return new AIMessage(msg.content);
      return new HumanMessage(msg.content);
    });
    console.log(agentMessages);
    console.log('invoking llm now');
    const response = (await this.agent.invoke({
      messages: agentMessages,
    })) as unknown as AIMessage;
    console.log('message type:', typeof response);
    return response;
  }
}
