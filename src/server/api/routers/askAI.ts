import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";

export const exampleRouter = createTRPCRouter({
  askAi: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      const config = new Configuration({
        apiKey: process.env.OPENAPI_KEY,
      });
      const openAi = new OpenAIApi(config);
      const res = await openAi.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input.message }],
        temperature: 0.8,
        max_tokens: 256,
        // stream: true,
      });
      console.log(res.data.choices[0]?.message);
      return res.data.choices[0]?.message;
    }),
});
