module.exports = (client) => {
    console.log('Duzko bot is ready!');
    client.user.setPresence({
        activities: [{
            name: 'I know exactly where you are',
            type: 'WATCHING'
        }],
        status: 'online'
    });
}