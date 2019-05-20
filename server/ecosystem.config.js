module.exports = {
    apps: [
        {
            name: 'stankin-labs',
            script: 'app.js',
            watch: true,
            ignore_watch: ['node_modules', 'uploads', 'client']
        }
    ]
};