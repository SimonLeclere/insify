import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers as nextHeaders } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

async function handleProxy(req: NextRequest) {
  try {
    // Authentifier la requête (similaire aux actions server)
    const session = await auth.api.getSession({
      headers: await nextHeaders(),
    });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer les settings utilisateur
    const settings = await prisma.settings.findUnique({
      where: { userId: session.user.id },
    });
    if (!settings || !settings.aiApiKey || !settings.aiProvider || !settings.aiModel) {
      return NextResponse.json({ error: 'Missing AI settings in user profile' }, { status: 400 });
    }

    // Utiliser les settings utilisateur pour construire l'appel API
    const pathSegments = req.nextUrl.pathname.split('/');
    const apiIndex = pathSegments.indexOf('ai');
    const endpointPath = pathSegments.slice(apiIndex + 1).join('/');

    let apiUrl: string;
    let apiKey: string;
    const provider: string = settings.aiProvider;

    // Adapter l'URL et la clé selon le provider
    if (provider === 'groq') {
      apiUrl = `https://api.groq.com/openai/v1/${endpointPath}`;
      apiKey = settings.aiApiKey;
    } else if (provider === 'openai') {
      apiUrl = `https://api.openai.com/v1/${endpointPath}`;
      apiKey = settings.aiApiKey;
    } else {
      return NextResponse.json({ error: 'Unsupported AI provider' }, { status: 400 });
    }

    const headers = new Headers(req.headers);
    headers.delete('host');
    headers.set('Authorization', `Bearer ${apiKey}`);
    headers.set('Content-Type', 'application/json');
    // Pour certains providers, il peut falloir ajouter d'autres headers ici

    const body = await req.text();

    const aiResponse = await fetch(apiUrl, {
      method: req.method,
      headers: headers,
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body,
      cache: 'no-store',
    });

    if (!aiResponse.ok) {
      const errorBody = await aiResponse.text();

      return new NextResponse(errorBody, {
        status: aiResponse.status,
        statusText: aiResponse.statusText,
        headers: aiResponse.headers,
      });
    }

    const responseHeaders = new Headers(aiResponse.headers);
    responseHeaders.delete('content-length');
    responseHeaders.delete('content-encoding');

    // Stream la réponse AI au client
    if (aiResponse.body) {
      return new NextResponse(aiResponse.body, {
        status: aiResponse.status,
        headers: responseHeaders,
      });
    } else {
      // fallback: pas de body streamable
      const text = await aiResponse.text();
      return new NextResponse(text, {
        status: aiResponse.status,
        headers: responseHeaders,
      });
    }
  } catch (error) {
    console.error('Erreur dans la route API proxy:', error);
    return NextResponse.json(
      { error: 'Internal server error in API proxy.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleProxy(req);
}
export async function POST(req: NextRequest) {
  return handleProxy(req);
}
export async function PUT(req: NextRequest) {
  return handleProxy(req);
}
export async function DELETE(req: NextRequest) {
  return handleProxy(req);
}
export async function PATCH(req: NextRequest) {
  return handleProxy(req);
}