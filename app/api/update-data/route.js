import { promises as fs } from 'fs';

export async function POST(req) {
    const data = await req.json();
    await fs.writeFile(process.cwd() + '/public/data.json', JSON.stringify(data), 'utf8');
    return new Response({});
}
