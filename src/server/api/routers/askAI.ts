import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import { prisma } from "~/server/db";

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
      const config = new Configuration({
        apiKey: process.env.OPENAPI_KEY,
      });
      const openAi = new OpenAIApi(config);

      let chat;
      let newMess;
      let updatedChat;
      if (!input.chatId) {
        chat = await prisma.chat.create({
          data: { userId: ctx.session?.user.id },
        });
      } else
        chat = await prisma.chat.findUnique({
          where: { id: input.chatId },
          include: { messages: true },
        });

      if (chat == null) return;
      newMess = await prisma.message.create({
        data: {
          role: "user",
          content: input.message,
          chatId: chat.id,
          userId: ctx.session.user.id,
        },
      });

      if (newMess === undefined) return;

      updatedChat = await prisma.chat.update({
        where: { id: chat.id },
        data: {
          messages: {
            connect: [{ id: newMess.id }],
          },
        },
        include: { messages: true },
      });
      const formatedChat = updatedChat.messages.map((message) => {
        return {
          role: message.role as ChatCompletionRequestMessageRoleEnum,
          content: message.content,
        };
      });
      console.log(formatedChat);
      const res = await openAi.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: formatedChat,
        temperature: 0.8,
        max_tokens: 4096,
        // stream: true,
      });

      if (res.data) {
        const reply = await prisma.message.create({
          data: {
            role: "assistant",
            content: res.data.choices[0]?.message?.content || "",
            chatId: chat.id,
          },
        });
        updatedChat = await prisma.chat.update({
          where: {
            id: chat.id,
          },
          data: {
            messages: { connect: [{ id: reply.id }] },
          },
          include: {
            messages: true,
          },
        });
      }
      return updatedChat;
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
