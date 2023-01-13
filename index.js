const Discord = require('discord.js');
 
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION" ]});

const { MessageEmbed } = require('discord.js');

const prefix = '!';
 
const fs = require('fs');

const memberCounter = require('./counters/member-counter');
const handler = require('./handlers/error_handler');
const salesbot = require('./salesbot');
const first = require('./first')
 
client.commands = new Discord.Collection();
 
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
 
    client.commands.set(command.name, command);
}
 
 
client.on('ready', () => {
    console.log('bot is online!');
    memberCounter(client);
    handler(client,Discord);
    first(client, Discord);
});

client.on('message', message => {
 
    if (!message.content.startsWith(prefix)) return;
    /*
    if(message.content.includes("https://") || message.content.includes("http://") || message.content.includes("discord.gg/")) { 
        if(message.guild.members.cache.find((member) => member.id === message.author.id).hasPermission("ADMINISTRATOR")){
            return;
        }
        else{
            message.delete()//backlisting links and deleting it
            let deleteEmbed = new MessageEmbed()
            .setTitle(`Link detected`) 
            .setDescription(`${message.author}, Links are not allowed in this server.`) 
            .setFooter('Link deleter') 
            .setColor('#00298c'); 
            message.channel.send(deleteEmbed); 
    }
    }*/
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'reactionrole'& message.guild.members.cache.find((member) => member.id === message.author.id).hasPermission("ADMINISTRATOR")) {
        message.channel.send("!clear 2");
        client.commands.get('reactionrole').execute(message, args, Discord, client);
    } else if (command === 'clear'& message.guild.members.cache.find((member) => member.id === message.author.id).hasPermission("ADMINISTRATOR")) {
        client.commands.get('clear').execute(message,args);
    } else if (command === 'ticket'& message.guild.members.cache.find((member) => member.id === message.author.id).hasPermission("ADMINISTRATOR")) {
        client.commands.get('ticket').execute(message, args, client, Discord);
    } else if (command === 'embed'& message.guild.members.cache.find((member) => member.id === message.author.id).hasPermission("ADMINISTRATOR")) {
        client.commands.get('embeds').execute(message, args, Discord);
    } else if (command === 'imageembed'& message.guild.members.cache.find((member) => member.id === message.author.id).hasPermission("ADMINISTRATOR")) {
        client.commands.get('imageembed').execute(message, args, Discord);
    } else if (command === 'joinrole'& message.guild.members.cache.find((member) => member.id === message.author.id).hasPermission("ADMINISTRATOR")) {
        client.commands.get('joinrole').execute(message, args, client);
    } else if (command === 'salesbot'& message.guild.members.cache.find((member) => member.id === message.author.id).hasPermission("ADMINISTRATOR")) {
        salesbot(message,args);
    }
  
});
 
client.login('add your own code');