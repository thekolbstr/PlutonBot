const Discord = require('discord.js');
const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]});
const enmap = require('enmap');
const {token, prefix} = require('./config.json');
const { Permissions } = require('discord.js');
const permissions = new Permissions(730930698516693045);



const settings = new enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});

client.on('ready', () => {
    console.log('Bot is online Homie')
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "ticket-setup") {
        // ticket-setup #channel

        let channel = message.mentions.channels.first();
        if(!channel) return message.reply("Usage: `!ticket-setup #channel`");

        let sent = await channel.send(new Discord.MessageEmbed()
            .setTitle("𝙋𝙡𝙪𝙩𝙤𝙣’𝙨 𝙏𝙞𝙘𝙠𝙚𝙩 𝙎𝙮𝙨𝙩𝙚𝙢")
            .setDescription("Please create a ticket if you need assistance with a menu or are interested in purchasing something or if you have any question comments or concerns.")
            .setFooter("Ticket System")
            .setColor("7122FA")
        );

        sent.react('🎫');
        settings.set(`${message.guild.id}-ticket`, sent.id);

        message.channel.send("Ticket System Setup Done!")
    }

    if(command == "close") {
        if(!message.channel.name.includes("ticket-")) return message.channel.send("You cannot use that here!")
        message.channel.delete();
    }
});



client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);
   
    if(!ticketid) return;

    if(reaction.message.id == ticketid && reaction.emoji.name == '🎫') {
        reaction.users.remove(user);
        
        reaction.message.guild.channels.create(`ticket-${user.username}`, {
          
            permissionOverwrites: [
                
                    {
                        id: user.id,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                    },
                    {
                        id: reaction.message.guild.roles.everyone,
                         deny: ["VIEW_CHANNEL"]
                    },
                
                    
              
                                
            ],
            type: 'text'

        }).then(async channel => {
            
            channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("Welcome to your ticket!").setDescription(`will be here to help you soon`).setColor("00ff00"))
            
        })
    }
});

client.login('NzUwOTA3OTU1NTY1ODIxOTUy.X1BXhw.Z42lKVE4J4twq3iFP8VQUTTgx0A');