import { Extension } from "@tiptap/core";

export const extensions = [
  Extension.create({
    name: "arrowConversion",

    addInputRules() {
      return [
        {
          find: /->/g,
          handler: ({ state, range, chain }) => {
            const { from, to } = range;
            const tr = state.tr.replaceWith(from, to, state.schema.text("→"));
            chain().insertContent(tr).run();
          },
        },
      ];
    },
  }),
  Extension.create({
    name: "heartConversion",
    addInputRules() {
      return [
        {
          find: /<3/g,
          handler: ({ state, range, chain }) => {
            const { from, to } = range;
            const tr = state.tr.replaceWith(from, to, state.schema.text("❤️"));
            chain().insertContent(tr).run();
          },
        },
      ];
    },
  }),
];
