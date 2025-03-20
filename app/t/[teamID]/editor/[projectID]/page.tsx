import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Editor } from "@/components/editor/DynamicEditor";

export default async function Page({ params }: {
  params: Promise<{ teamID: string, projectID: string }>;
}) {

  const { projectID } = await params;

  const project = await prisma.project.findUnique({
      where: { id: +projectID },
    });

  if (!project) return notFound()

  return (
    <div className="xl:px-40">
      <Editor project={project} projectId={projectID} />
    </div>
  )
}