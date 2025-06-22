import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Editor } from "@/components/editor/DynamicEditor";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ teamID: string; projectID: string }>;
}) {
  const { projectID } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session?.user) {
    return redirect("/auth/login");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectID },
  });
  if (!project) return notFound();

  return (
    <div className="xl:px-40 pt-4">
      <Editor user={session.user} project={project} />
    </div>
  );
}
