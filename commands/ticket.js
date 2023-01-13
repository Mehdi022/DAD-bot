module.exports = {
    name: "ticket",
    aliases: [],
    permissions: [],
    description: "open a ticket!",
    async execute(message, args, client, Discord) {
        if(!args[0]) return message.reply("please enter the id of category!");
        const { MessageEmbed } = require('discord.js');
        if(isNaN(args[0])) return message.reply("please enter the id category it must be numbers!");
        const parentChannel = args[0];
        const mesg = new MessageEmbed()
            .setTitle('SUPPORT')
            .setDescription('react with 📬 to open a ticket!\n or react with 🤝 to open a collabs ticket!\n ')
            .setAuthor('DAD')
            .setColor('#008000')
            .setFooter('TICKETS');
        const mainChannel = await message.guild.channels.create(`open ticket`);
        await mainChannel.setParent(parentChannel);
        mainChannel.permissionOverwrites.edit(guild.id, {
            SEND_MESSAGE: false,
        });
        const mainReactionMessage = await mainChannel.send(mesg);
        const supportEmoji = '📬';
        const supportEmoji2 = '🤝';
        mainReactionMessage.react(supportEmoji);
        mainReactionMessage.react(supportEmoji2);
        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
 
            if (reaction.message.id == mainReactionMessage.id) {
                if (reaction.emoji.name === supportEmoji || reaction.emoji.name === supportEmoji2) {
                    const channel = await message.guild.channels.create(`ticket: ${message.author.tag}`);
                    channel.setParent(parentChannel);
                    channel.permissionOverwrites.edit(guild.id, { VIEW_CHANNEL: false,
                        SEND_MESSAGE: false,
                     });
                    channel.permissionOverwrites.edit(message.author, {
                        SEND_MESSAGE: true,
                        VIEW_CHANNEL: true,
                    });
                    if(reaction.emoji.name === supportEmoji2){
                        channel.setName(`collabs ticket: ${message.author.tag}`);
                    }
                
                    const reactionMessage = await channel.send("Thank you for contacting support!");
                
                    try {
                        await reactionMessage.react("🔒");
                        await reactionMessage.react("⛔");
                    } catch (err) {
                        channel.send("Error sending emojis!");
                        throw err;
                    }
                
                    const collector = reactionMessage.createReactionCollector(
                        (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).hasPermission("ADMINISTRATOR"),
                        { dispose: true }
                    );
                
                    collector.on("collect", (reaction, user) => {
                        switch (reaction.emoji.name) {
                        case "🔒":
                            channel.updateOverwrite(message.author, { SEND_MESSAGES: false });
                            break;
                        case "⛔":
                            channel.send("Deleting this channel in 5 seconds!");
                            setTimeout(() => channel.delete(), 5000);
                            break;
                        }
                    });
                    const mesg2 = new MessageEmbed()
                        .setTitle('SUPPORT')
                        .setDescription(`We will be right with you! <@${message.author.id}>\n`)
                        .setAuthor('DAD')
                        .setColor('#008000')
                        .setFooter('TICKETS');
                    channel
                        .send(mesg2)
                        .then((msg) => {
                        setTimeout(() => msg.delete(), 7000);
                        setTimeout(() => message.delete(), 3000);
                        })
                        .catch((err) => {
                        throw err;
                    });
                }
            } else {
                return;
            }
 // ${channel}
        });
    },
  };