module.exports = {
    name: 'joinrole',
    description: 'this is clear BOT!',
    async execute(message,args, client){
        const roleWelcome = args[0];
        const welcomeCHannel = args[1];
        client.on('guildMemberAdd', guildMember =>{
            let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === roleWelcome);
         
            guildMember.roles.add(welcomeRole);
            guildMember.guild.channels.cache.get(welcomeCHannel).send(`Welcome recruit <@${guildMember.user.id}> \n to become a soldier verify that you are not a bot!`)
        });
    }
}