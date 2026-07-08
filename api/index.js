module.exports = (req, res) => {
    // Prevents security blocks from the browser
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 1. Hands Nuvio the Manifest
    if (req.url.includes('/manifest.json')) {
        return res.json({
            id: 'org.myaddon.cinestream',
            version: '1.0.0',
            name: 'CineStream Direct',
            description: 'Direct Web Streams',
            resources: ['stream'],
            types: ['movie'],
            idPrefixes: ['tt']
        });
    }

    // 2. Hands Nuvio the Video Link
    if (req.url.includes('/stream/movie/')) {
        const id = req.url.split('/').pop().replace('.json', '');
        return res.json({
            streams: [{
                name: 'CineStream',
                title: '1080p | Direct Web',
                externalUrl: `https://vidsrc.me/embed/movie?imdb=${id}`
            }]
        });
    }

    // 3. Catches any other random traffic
    return res.status(404).send('Not Found');
};
