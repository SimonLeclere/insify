'use client';

import { Plate } from '@udecode/plate/react';
import type { Value } from '@udecode/plate';
import { useCreateEditor } from '@/components/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { useSync } from '@/providers/SyncProvider';
import { Prisma } from '@prisma/client';

type Project = Prisma.ProjectGetPayload<object>;

export function PlateEditor({ projectId, project }: { projectId: string, project: Project }) {

  const editor = useCreateEditor(JSON.parse(project.nodes));
  const { syncProject } = useSync();

  return (
    <Plate
      editor={editor}
      onChange={({ value }: { value: Value }) => {
        syncProject(projectId, value)
      }}
    >
      <EditorContainer>
        <Editor variant="default" placeholder="Nouveau projet" className="px-4 lg:px-0" />
      </EditorContainer>
    </Plate>
  );
}
