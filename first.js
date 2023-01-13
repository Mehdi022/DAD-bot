module.exports = async (client, Discord) =>{
    const guild = client.guilds.cache.get('987836797084106863');
    const adminChannel = guild.channels.cache.get('988386059085828096');
    const roleChannel = guild.channels.cache.get('987846568298299432');
    adminChannel.send('!joinrole recruit 988383927230152734');
    adminChannel.send('!salesbot 3xVDoLaecZwXXtN59o6T3Gfxwjcgf8Hc9RfoqBn995P9 webhook');
    roleChannel.send('!reactionrole 989649326932377600 soldier ✅ recruit');
}