export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        
        // Si Anthropic devuelve error, lo pasamos completo
        if (!response.ok) {
            return res.status(response.status).json({ 
                anthropic_error: data,
                status: response.status,
                key_present: !!process.env.ANTHROPIC_API_KEY,
                key_prefix: process.env.ANTHROPIC_API_KEY?.substring(0, 10)
            });
        }
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            key_present: !!process.env.ANTHROPIC_API_KEY
        });
    }
}
