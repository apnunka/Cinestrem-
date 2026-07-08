const axios = require('axios');

module.exports = async (req, res) => {
    // Prevents browser security blocks
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 1. Hands Nuvio the Manifest
    if (req.url.includes('/manifest.json')) {
        return res.json({
            id: 'org.myaddon.cinestream.native',
            version: '2.0.0',
            name: 'CineStream Pro',
            description: 'Native Streams (FlixHQ, VidSrc, ZoeChip, etc.)',
            resources: ['stream'],
            types: ['movie', 'series'],
            idPrefixes: ['tt']
        });
    }

    // 2. Intercepts the Nuvio request and fetches raw links
    if (req.url.includes('/stream/')) {
        const path = req.url.split('/stream/')[1]; // Extracts "movie/tt1234567.json"
        
        try {
            // We route the request through a heavy-duty community API (like Superflix/Stremify) 
            // that already has the Cloudflare bypasses for your requested sources.
            const { data } = await axios.get(`https://stremify.elfhosted.com/stream/${path}`, {
                timeout: 8000 // Vercel free tier limit protection
            });
            
            // Re-brand the scraped links to your custom addon name
            if (data && data.streams) {
                data.streams = data.streams.map(stream => {
                    // This keeps the original source name (like "FlixHQ" or "VidSrc") but tags it to CineStream
                    const sourceName = stream.name || 'Web';
                    stream.name = 'CineStream';
                    stream.title = `${sourceName} | ${stream.title || 'Native 1080p'}\nDirect Server`;
                    return stream;
                });
            }
            return res.json(data);
            
        } catch (error) {
            // If the primary scraper fails, return an empty array so Nuvio doesn't crash
            return res.json({ streams: [] });
        }
    }

    // 3. Catches random traffic
    return res.status(404).send('Not Found');
};
