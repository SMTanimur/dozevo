import { NextRequest, NextResponse } from 'next/server';
import HTMLtoDOCX from 'html-to-docx';

// Force Node.js runtime — html-to-docx requires fs (not available in Edge)
export const runtime = 'nodejs';


export async function POST(req: NextRequest) {
  try {
    const { title, html } = (await req.json()) as { title: string; html: string };

    const safeName = (title ?? 'Document').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const fullHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${safeName}</title></head>
<body>
  <h1>${safeName}</h1>
  ${html ?? ''}
</body>
</html>`;

    const result = await HTMLtoDOCX(fullHtml, undefined, {
      table: { row: { cantSplit: true } },
      footer: false,
      pageNumber: false,
      font: 'Calibri',
      fontSize: 22,
      margins: { top: 720, right: 900, bottom: 720, left: 900 },
    });

    // result is Buffer (Node) – Buffer extends Uint8Array which is valid BodyInit
    const body = result as unknown as BodyInit;

    const filename = `${(title ?? 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document'}.docx`;

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('DOCX export error:', err);
    return NextResponse.json({ error: 'Failed to generate DOCX' }, { status: 500 });
  }
}
