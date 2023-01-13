module.exports = {
    name: 'imageembed',
    description: 'this is YOHAN BOT!',
    async execute(message,args, Discord){
        const MINUTES = 5;
        const { MessageEmbed } = require('discord.js');
        let questions = [
          { answer: null, field: 'title' },
          { answer: null, field: 'description' },
          { answer: null, field: 'author name' },
          { answer: null, field: 'colour' },
          { answer: null, field: 'image' },
          { answer: null, field: 'footer' },
        ];
          let current = 0;
      
          // wait for the message to be sent and grab the returned message
          // so we can add the message collector
          const sent = await message.author.send(
            `**Question 1 of ${questions.length}:**\nWhat would you like the ${questions[current].field} be?`,
          );
      
          const filter = (response) => response.author.id === message.author.id;
          // send in the DM channel where the original question was sent
          const collector = sent.channel.createMessageCollector(filter, {
            max: questions.length,
            time: MINUTES * 60 * 1000,
          });
      
          // fires every time a message is collected
          collector.on('collect', (message) => {
            // add the answer and increase the current index
            questions[current++].answer = message.content;
            //
            //if(questions[current].answer === 'no') {questions[current].answer = NULL;}
            const hasMoreQuestions = current < questions.length;
      
            if (hasMoreQuestions) {
              message.author.send(
                `**Question ${current + 1} of ${questions.length}:**\nWhat would you like the ${questions[current].field} be?`,
              );
            }
          });
      
          // fires when either times out or when reached the limit
          collector.on('end', (collected, reason) => {
            if (reason === 'time') {
              return message.author.send(
                `I'm not saying you're slow but you only answered ${collected.size} questions out of ${questions.length} in ${MINUTES} minutes. I gave up.`,
              );
            }
              let embed = new MessageEmbed()
              .setTitle(questions[0].answer)
              .setDescription(questions[1].answer)
              .setAuthor(questions[2].answer)
              .setColor(questions[3].answer)
              .setImage(questions[4].answer)
              .setFooter(questions[5].answer);
              
            message.author.send('Here is your embed:');
            message.author.send(embed);
            // send a message for confirmation
            message.author.send('Would you like it to be published? `y[es]/n[o]`');
            message.author.dmChannel
              .awaitMessages(
                // set up a filter to only accept y, yes, n, and no
                (m) => ['y', 'yes', 'n', 'no'].includes(m.content.toLowerCase()),
                { max: 1 },
              )
              .then((coll) => {
                let response = coll.first().content.toLowerCase();
                if (['y', 'yes'].includes(response)) {
                  // publish embed, like send in a channel, etc
                  // then let the member know that you've finished
                  message.author.send('Great, the embed is published.');
                  message.channel.send(embed);
                } else {
                  // nothing else to do really, just let them know what happened
                  message.author.send('Publishing the embed is cancelled.');
                }
              })
        });
    }
}