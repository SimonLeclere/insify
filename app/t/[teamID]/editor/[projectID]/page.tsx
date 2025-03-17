import { PlateEditor } from '@/components/editor/plate-editor';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function Page({ params }: {
  params: Promise<{ teamID: string, projectID: string }>;
}) {

  const { projectID } = await params;

  const project = await prisma.project.findUnique({
      where: { id: +projectID },
    });

  if (!project) return notFound()

  return (
    <div className="w-full" data-registry="plate">
      <PlateEditor projectId={projectID} project={project} />
    </div>
  );
}
