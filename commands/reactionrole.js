module.exports = {
    name: 'reactionrole',
    description: "Sets up a reaction role message!",
    async execute(message, args, Discord, client) {
        let idMessageEnter = args[0];
        let roleNamEnter = args[1];
        let emojiEnter = args[2];
        const messageId = idMessageEnter;
        const channel = idMessageEnter;
        const yellowTeamRole = message.guild.roles.cache.find(role => role.name === roleNamEnter);
        if(!args[0]) return message.reply("please enter the id message!");
        if(isNaN(args[0])) return message.reply("please enter the id message it must be numbers!");
        if(!args[1]) return message.reply("please enter the role name!");
        //if(Object.prototype.toString.call(args[1]) === "[object String]") return message.reply("please enter the role name it must be a string!");
        if(!args[2]) return message.reply("please enter the emoji!");
        //if(typeof args[2]=== typeof '✅') return message.reply("please enter the emoji!");
        const yellowTeamEmoji = emojiEnter;
        const roleNamEnterRemove = message.guild.roles.cache.find(role => role.name === args[3]);
        message.client.channels.fetch(message.channel.id).then(channel => {
            channel.messages.fetch(messageId).then(message => {
                message.react(yellowTeamEmoji);
            })
          })

        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
 
            if (reaction.message.id == messageId) {
                if (reaction.emoji.name === yellowTeamEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(yellowTeamRole);
                    if(args[3]){await reaction.message.guild.members.cache.get(user.id).roles.remove(roleNamEnterRemove);}
                }
            } else {
                return;
            }
 
        });
 
        client.on('messageReactionRemove', async (reaction, user) => {
 
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
 
            if (reaction.message.id == messageId & message.member.roles.cache.some(r => r.name === roleNamEnter)) {
                if (reaction.emoji.name === yellowTeamEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(yellowTeamRole);
                    if(args[3]){await reaction.message.guild.members.cache.get(user.id).roles.add(roleNamEnterRemove);}
                }
            } else {
                return;
            }
        });/*
        .catch(err) =>{
            channel.send('Error sending emojis!');
            throw err;
        }*/
    }
 
}