import { SuggestionMenuController } from "@blocknote/react";
import { getDefaultReactSlashMenuItems } from "@blocknote/react";
import { getAISlashMenuItems } from "@blocknote/xl-ai";
import { filterSuggestionItems, BlockNoteEditor } from "@blocknote/core";

export default function SuggestionMenuWithAI(props: {
  editor: BlockNoteEditor;
}) {
  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query) =>
        filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(props.editor),
            ...getAISlashMenuItems(props.editor),
          ],
          query,
        )
      }
    />
  );
}
