const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// 1. The Manifest Route
app.get('/api/manifest.json', (req, res) => {
    res.json({
        id: 'org.myaddon.cinestream',
        version: '1.0.0',
        name: 'CineStream Direct',
        description: 'Direct Web Streams for Nuvio TV',
        resources: ['stream'],
        types: ['movie'],
        idPrefixes: ['tt']
    });
});

// 2. The Video Stream Route
app.get('/api/stream/:type/:id.json', async (req, res) => {
    const { type, id } = req.params;
    
    if (type === 'movie' && id.startsWith('tt')) {
        try {
            // Get the movie name
            const metaRes = await axios.get(`https://v3-cinemeta.strem.io/meta/movie/${id}.json`);
            const title = metaRes.data?.meta?.name || 'Movie';
            
            // Set the web player link
            const embedUrl = `https://vidsrc.me/embed/movie?imdb=${id}`;

            return res.json({
                streams: [
                    {
                        name: 'CineStream',
                        title: `${title}\n1080p | Direct Web Player`,
                        externalUrl: embedUrl
                    }
                ]
            });
        } catch (error) {
            return res.json({ streams: [] });
        }
    }
    return res.json({ streams: [] });
});

module.exports = app;
