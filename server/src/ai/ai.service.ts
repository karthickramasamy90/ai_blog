import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  // private openai: OpenAI;

  // constructor() {
  //   console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
  //   this.openai = new OpenAI({
  //     apiKey: process.env.OPENAI_API_KEY, // 🔹 Store in .env
  //   });
  // }

  // async generateBlogContent(topic: string): Promise<string> {
  //   const response = await this.openai.chat.completions.create({
  //     model: 'gpt-3.5-turbo', // 🔹 Use GPT-3
  //     messages: [{ role: 'system', content: `Write a detailed blog about "${topic}"` }],
  //     max_tokens: 500,
  //   });

  //   return response.choices[0].message?.content || 'No content generated.';
  // }

  private genAI: GoogleGenerativeAI;
  private chatSession: ChatSession | null = null;; // optionally track sessions

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }

  startChatSession(): void {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    this.chatSession = model.startChat();
  }

  async generateBlogContent(topic: string) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Write a blog post about "${topic}" with a professional tone.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  }

  async generateAnswer(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
  
    const response = await result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "No answer generated.";
  
    return text;
  }

  async askGemini(question: string): Promise<string> {
    const prompt = `Answer the following question: ${question}`;
    const response = await this.generateAnswer(prompt);

    return response;
  }

  async startChat(sessionId: string): Promise<string> {
    // if (this.chatSession) {
    //   throw new Error('Chat session already started');
    // }
    // Generate a unique session ID if not provided
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const chat = model.startChat();
    this.chatSession[sessionId] = chat;

    return sessionId;
  }

  async sendMessage(sessionId: string, message: string): Promise<string> {
    const chat = this.chatSession[sessionId];
    if (!chat) {
      throw new Error('Chat session not found');
    }

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  }

}
