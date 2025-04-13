import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  // @Post('generate')
  // async generateBlog(@Body('topic') topic: string) {
  //   return { content: await this.aiService.generateBlogContent(topic) };
  // }

    @Post('generate')
    async generateBlog(@Body('topic') topic: string) {
      return this.aiService.generateBlogContent(topic);
    }

    @Post('ask')
    async askQuestion(@Body() body: { prompt: string }) {
      const answer = await this.aiService.askGemini(body.prompt);

      return { answer };
    }

    @Post('start-chat')
    async startChat(@Body('sessionId') sessionId: string) {
      const startChat = this.aiService.startChatSession();
      // if(startChat) {
      //   console.log('Chat session started successfully!'); 
      // }
      return { sessionId: this.aiService.startChat(sessionId) };
    }

    @Post('chat')
    async sendMessage(@Body() body: { sessionId: string; message: string }) {
      const reply = await this.aiService.sendMessage(body.sessionId, body.message);
      return { reply };
    }
}
