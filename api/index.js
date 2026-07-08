const axios = require('axios');

module.exports = async (req, res) => {
    // Prevents browser security blocks
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 1. Hands Nuvio the Manifest
    if (req.url.includes('/manifest.json')) {
        return res.json({
            id: 'org.myaddon.cinestream.ultimate',
            version: '3.0.0',
            name: 'CineStream Ultimate',
            description: 'Native Streams (Cloudflare Bypassed)',
            resources: ['stream'],
            types: ['movie', 'series'],
            idPrefixes: ['tt']
        });
    }

    // 2. The API Hijack Router
    if (req.url.includes('/stream/')) {
        const path = req.url.split('/stream/')[1]; 
        
        try {
            // We ping an open-source HTTP Stremio aggregator that already has the bypasses running 24/7
            const { data } = await axios.get(`https://flix-streams.vercel.app/stream/${path}`, {
                timeout: 8000 
            });
            
            // Re-brand the extracted, unlocked raw links as your own
            if (data && data.streams) {
                data.streams = data.streams.map(stream => {
                    stream.name = 'CineStream';
                    stream.title = `Direct Native | ${stream.title || '1080p'}`;
                    return stream;
                });
            }
            return res.json(data || { streams: [] });
            
        } catch (error) {
            return res.json({ streams: [] });
        }
    }

    // 3. Catches random traffic
    return res.status(404).send('Not Found');
};
