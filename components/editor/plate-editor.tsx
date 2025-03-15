'use client';

import { Plate } from '@udecode/plate/react';

import { useCreateEditor } from '@/components/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';

export function PlateEditor() {
  const editor = useCreateEditor();

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor variant="default" placeholder="Nouveau projet" />
      </EditorContainer>
    </Plate>
  );
}
