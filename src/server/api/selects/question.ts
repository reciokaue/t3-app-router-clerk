export const questionSelect = {
  id: true,
  text: true,
  index: true,
  questionType: true,
  options: {
    select: {
      id: true,
      index: true,
      text: true,
    },
  },
  _count: {
    select: {
      responses: true,
    },
  },
}
