import { FormattingToolbar, FormattingToolbarController } from "@blocknote/react";
import { AIToolbarButton } from "@blocknote/xl-ai";
import { getFormattingToolbarItems } from "@blocknote/react";

export default function FormattingToolbarWithAI() {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          {...getFormattingToolbarItems()}
          <AIToolbarButton />
        </FormattingToolbar>
      )}
    />
  );
}
