const { addonBuilder, getRouter } = require('stremio-addon-sdk');
const express = require('express');
const axios = require('axios');

const manifest = {
    id: 'org.myaddon.cinestream',
    version: '1.0.0',
    name: 'CineStream Vercel Build',
    description: 'Direct HTTP Web Streams for Nuvio TV',
    resources: ['stream'],
    types: ['movie'],
    idPrefixes: ['tt']
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
    if (type === 'movie' && id.startsWith('tt')) {
        try {
            const metaRes = await axios.get(`https://v3-cinemeta.strem.io/meta/movie/${id}.json`);
            const title = metaRes.data.meta.name;
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

const app = express();
app.use('/', getRouter(builder.getInterface()));
module.exports = app;
