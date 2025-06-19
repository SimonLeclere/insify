"use server";

import { getServerAuth } from "@/hooks/serverAuth";
import { prisma } from "@/lib/prisma";
import { PDFExporter, pdfDefaultSchemaMappings } from "@blocknote/xl-pdf-exporter";
import * as ReactPDF from "@react-pdf/renderer";
import { BlockNoteSchema } from "@blocknote/core";
import { DefaultBlockSchema as b, DefaultInlineContentSchema as i, DefaultStyleSchema as s } from '@blocknote/core'
import * as Y from "yjs";

export async function exportProject(projectId: number, schema: BlockNoteSchema<b,i,s>) {
  if (!projectId) {
    return { success: false, data: null, error: "Aucun projet sélectionné." };
  }

  try {
    const session = await getServerAuth();
    if (!session) {
      return { success: false, data: null, error: "Utilisateur non connecté." };
    }

    const userId = session?.user?.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return {
        success: false,
        data: null,
        error: "Le projet sélectionné n'existe pas.",
      };
    }

    const teamUser = await prisma.teamUser.findFirst({
      where: { teamId: project.teamId, userId: userId },
    });
    if (!teamUser) {
      return { success: false, data: null, error: "Manque de permissions." };
    }

    if (!project.content) return { success: false, data: null, error: "Projet vide." };

    // Convertir le contenu Yjs en document BlockNote
    try {
      const doc = new Y.Doc();
      Y.applyUpdate(doc, new Uint8Array(project.content));
      const fragment = doc.getXmlFragment("document-store");
      
      // Pour l'instant, retournons une erreur car nous devons implémenter la conversion Yjs -> BlockNote
      return { success: false, data: null, error: "Export temporairement indisponible - conversion Yjs en cours de développement." };
      
      // TODO: Implémenter la conversion du fragment XML Yjs vers le format BlockNote
      // blockNoteDocument = convertYjsToBlockNote(fragment);
      // const exporter = new PDFExporter(schema, pdfDefaultSchemaMappings);
      // const pdfDocument = await exporter.toReactPDFDocument(blockNoteDocument);
      // const pdfBlob = await ReactPDF.pdf(pdfDocument).toBlob();
      // return { success: true, data: pdfBlob, error: null };
    } catch (error) {
      console.error("Erreur lors de la conversion du contenu Yjs:", error);
      return { success: false, data: null, error: "Erreur lors de la conversion du contenu." };
    }
    
  } catch (error) {
    console.error("Erreur lors l'exportation du projet :", error);
    return { success: false, data: null, error: "Erreur inconnue." };
  }
}

export async function restoreProject(projectId: number) {
  try {
    const restoredProject = await prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: null }, // Restaurer le projet
    });

    return { success: true, data: restoredProject, error: null };
  } catch (error) {
    console.error("Erreur lors de la restauration du projet :", error);
    return { success: false, data: null, error: "Impossible de restaurer." };
  }
}