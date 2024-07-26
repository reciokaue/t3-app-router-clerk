import { currentUser, useUser } from '@clerk/nextjs'
import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'

import { formSelect } from '../selects/form'
// import { prisma } from '../lib/prisma';
// import { currentUser } from '@clerk/nextjs';
// import { jwtRequest } from '../middlewares/JWTAuth';
// import { paginationSchema } from '../utils/schemas/pagination';
// import { formSchemaCreate, formSchemaUpdate } from '../utils/schemas/form';
// import { formatForm } from '../utils/format/form';
// import { formDetailSelect, formSelect } from '../utils/selects/form';
// import { questionSchemaCreate } from '../utils/schemas/question';

// const paramsSchema = z.object({
//   id: z.coerce.number().positive().int().optional(),
// });

export const formRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  // This is a protected procedure, meaning that the user must be logged in to access it. If they try to
  // access it without being logged in, they will get an UNAUTHORIZED error.
  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     const user = await currentUser();

  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //         clerkUser: ctx.session.userId,
  //         email: user?.emailAddresses[0]?.emailAddress ?? "",
  //       },
  //     });
  //   }),

  getFormsByUser: protectedProcedure
    .input(z.object({ query: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.form.findMany({
        where: {
          clerkUser: String(ctx.session.userId),
          ...(input.query && {
            OR: [
              { name: { contains: input.query } },
              { about: { contains: input.query } },
            ],
          }),
        },
        select: formSelect,
        orderBy: { createdAt: 'desc' },
      })
    }),

  // getAllPosts: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findMany({
  //     orderBy: { createdAt: "desc" },
  //   });
  // }),
})

// export const formRouter = createTRPCRouter({
//   getForms: publicProcedure
//     .input(paginationSchema)
//     .query(async ({ input, ctx }) => {
//       const { page, pageSize, query, isPublic } = input;
//       const forms = await prisma.form.findMany({
//         where: {
//           ...(query && {
//             OR: [{ name: { contains: query } }, { about: { contains: query } }],
//           }),
//           ...(isPublic ? { isPublic: true } : { userId: ctx.session?.userId }),
//         },
//         take: pageSize,
//         skip: pageSize * page,
//         select: formSelect,
//       });
//       return forms.map((form) => formatForm(form));
//     }),

//   getFormById: publicProcedure
//     .input(paramsSchema)
//     .query(async ({ input }) => {
//       const { id } = input;
//       const form = await prisma.form.findUnique({
//         where: { id },
//         select: formDetailSelect,
//       });

//       if (!form) throw new Error('Formulário não encontrado');
//       return formatForm(form);
//     }),

//   createForm: protectedProcedure
//     .input(formSchemaCreate.extend({ baseFormId: z.number().optional() }))
//     .mutation(async ({ input, ctx }) => {
//       const { baseFormId, ...form } = input;
//       form.userId = ctx.session.userId;
//       const topics = form.topics;
//       delete form.topics;

//       const newForm = await prisma.form.create({
//         data: {
//           ...form,
//           ...(baseFormId && (await getBaseFormQuestions(baseFormId))),
//         },
//       });

//       await prisma.formTopic.createMany({
//         data: topics.map((topicId) => ({
//           formId: newForm.id,
//           topicId,
//         })),
//         skipDuplicates: true,
//       });

//       return newForm;
//     }),

//   updateForm: protectedProcedure
//     .input(formSchemaUpdate.extend({ id: z.number() }))
//     .mutation(async ({ input }) => {
//       const { id, ...form } = input;
//       const topics = form.topics;
//       delete form.topics;
//       delete form.questions;

//       const formExists = await prisma.form.findUnique({
//         where: { id },
//         select: formSelect,
//       });

//       if (!formExists) throw new Error('Formulário não encontrado');

//       const topicsIds = formExists.formTopics.map((formTopic) => formTopic.topic.id);
//       const deletedTopics = topicsIds.filter((topic) => !topics.includes(topic));
//       const newTopics = topics.filter((topic) => !topicsIds.includes(topic));

//       await prisma.form.update({
//         where: { id },
//         data: {
//           ...form,
//           formTopics: {
//             deleteMany: deletedTopics.map((topicId) => ({ topicId, formId: id })),
//             createMany: { data: newTopics.map((topicId) => ({ topicId })) },
//           },
//         },
//       });
//     }),

//   deleteForm: protectedProcedure
//     .input(paramsSchema)
//     .mutation(async ({ input, ctx }) => {
//       const { id } = input;
//       const form = await prisma.form.findUnique({
//         where: { id },
//       });

//       if (!form) throw new Error('Formulário não encontrado');
//       if (form.userId !== ctx.session.userId && ctx.session.access === 0) {
//         throw new Error('Este não é o seu formulário');
//       }

//       await prisma.form.delete({
//         where: { id: form.id },
//       });

//       return form;
//     }),

//   updateQuestionOrder: protectedProcedure
//     .input(z.object({ id: z.number(), from: z.number().int(), to: z.number().int() }))
//     .mutation(async ({ input }) => {
//       const { id, from, to } = input;
//       if (from === to) return;

//       const questions = await prisma.question.findMany({
//         where: {
//           formId: id,
//           index: { in: [from, to] },
//         },
//         orderBy: { index: 'asc' },
//         select: { id: true, index: true },
//       });

//       await prisma.question.update({
//         where: { id: questions[0].id },
//         data: { index: questions[1].index },
//       });

//       await prisma.question.update({
//         where: { id: questions[1].id },
//         data: { index: questions[0].index },
//       });

//       return { from, to, id, questions };
//     }),
// });

// async function getBaseFormQuestions(id: number) {
//   const baseForm = await prisma.form.findUnique({
//     where: { id },
//     include: {
//       questions: {
//         include: { options: true },
//       },
//     },
//   });

//   if (!baseForm) throw new Error('Base formulário não encontrado');

//   return {
//     questions: {
//       create: baseForm.questions.map((question) =>
//         questionSchemaCreate.parse(question)
//       ),
//     },
//   };
// }
