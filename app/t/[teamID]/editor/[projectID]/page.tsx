import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Editor } from "@/components/editor/DynamicEditor";
import { getServerAuth } from "@/hooks/serverAuth";

export default async function Page({
  params,
}: {
  params: Promise<{ teamID: string; projectID: string }>;
}) {
  const { projectID } = await params;
  const session = await getServerAuth()

  if (!session || !session.user) return redirect("/auth/login");
  
  const project = await prisma.project.findUnique({
    where: { id: +projectID },
  });
  if (!project) return notFound();

  const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
  
    if (!user) return redirect("/auth/login");


  // Le contenu initial est maintenant chargé automatiquement via Yjs
  // depuis la base de données dans le composant Editor

  return (
    <div className="xl:px-40 pt-4">
      <Editor content={undefined} projectId={projectID} user={user}/>
    </div>
  );
}
