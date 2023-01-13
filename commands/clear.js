module.exports = {
    name: 'clear',
    description: 'this is clear BOT!',
    async execute(message,args){
        //if(message.member.roles.cache.has('752254675431981097')|| message.member.roles.cache.some(r => r.name === "CO-OWNER")){
        if(!args[0]) return message.reply("please enter the amount of messages that you want to delete!");
        if(isNaN(args[0])) return message.reply("please enter a real number 1 to 100");

        if(args[0] > 100) return message.reply("You can't delete more than 100 messages!");
        if(args[0] < 1) return message.reply("You need to at least delete 1 message!");

        await message.channel.messages.fetch({limit: args[0]}).then(messages => {
            message.channel.bulkDelete(messages);
        });
            
        //}
        //else message.reply('not enough permissions').catch(console.error);
    }
}