import { prisma } from "./../../db";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAPI_KEY,
});
const openAi = new OpenAIApi(config);
export const AskAiRouter = createTRPCRouter({
  askAi: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        chatId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user.id) return;
      try {
        let chat;
        if (!input.chatId) {
          chat = await prisma.chat.create({
            data: {
              userId: ctx.session?.user.id,
              messages: { create: { role: "user", content: input.message } },
            },
            include: { messages: true },
          });
        } else
          chat = await prisma.chat.update({
            where: { id: input.chatId },
            data: {
              messages: { create: { role: "user", content: input.message } },
            },
            include: { messages: true },
          });

        if (chat == null) return;

        const formatedChat = chat.messages.map((message) => {
          return {
            role: message.role as ChatCompletionRequestMessageRoleEnum,
            content: message.content,
          };
        });
        const res = await openAi.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: formatedChat,
          temperature: 0.8,
          max_tokens: 2048,
          // stream: true,
        });

        if (res.data) {
          await prisma.chat.update({
            where: { id: chat.id },
            data: {
              messages: {
                create: {
                  // role: res.data.choices[0]?.message?.role || undefined,
                  role: "assistant",
                  content: res.data.choices[0]?.message?.content || "",
                },
              },
            },
          });
        }
        return chat;
      } catch (error) {
        throw error;
      }
    }),
  streaming: protectedProcedure.mutation(async () => {
    const completion = await openAi.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello!" },
        ],
        temperature: 0.8,
        max_tokens: 128,
        stream: true,
        stop: ["\n\n"],
      },
      { responseType: "stream" }
    );
    // for (const chunk of completion) {
    //   console.log(chunk.choices[0].delta.content);
    // }
    console.log(completion);
  }),

  chats: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.chat.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  chatById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const chatById = await prisma.chat.findUnique({
        where: { id: input.id },
        include: { messages: true },
      });
      return chatById;
    }),

  renameChat: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(({ input, ctx }) => {}),

  deleteChat: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const deletedChat = await prisma.chat.delete({ where: { id: input.id } });
      return deletedChat;
    }),
});
