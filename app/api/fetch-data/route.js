import { promises as fs } from 'fs';

export async function GET() {
    const file = await fs.readFile(process.cwd() + '/public/data.json', 'utf8');
    const data = JSON.parse(file);
    
    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    });
}