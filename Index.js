const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const manifest = {
    id: 'org.myaddon.cinestream',
    version: '1.0.0',
    name: 'CineStream iPhone Build',
    description: 'Direct HTTP Web Streams for Nuvio TV',
    resources: ['stream'],
    types: ['movie'],
    idPrefixes: ['tt']
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
    if (type === 'movie' && id.startsWith('tt')) {
        try {
            // Fetches the movie name using Stremio's official metadata engine
            const metaRes = await axios.get(`https://v3-cinemeta.strem.io/meta/movie/${id}.json`);
            const title = metaRes.data.meta.name;

            // Direct HTTP embed player link
            const embedUrl = `https://vidsrc.me/embed/movie?imdb=${id}`;

            return {
                streams: [
                    {
                        name: 'CineStream Web',
                        title: `${title}\n1080p | Open Web Player`,
                        externalUrl: embedUrl
                    }
                ]
            };
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    return { streams: [] };
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
