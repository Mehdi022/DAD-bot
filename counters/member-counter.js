module.exports = async (client) =>{
    const guild = client.guilds.cache.get('987836797084106863');
    setInterval(() =>{
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get('988393692748455986');
        channel.setName(`Total army: ${memberCount.toLocaleString()}`);
    }, 1000000);
}