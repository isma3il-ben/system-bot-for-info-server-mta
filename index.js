const { Client, Intents, MessageEmbed } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const cloodymta = require('gamedig');
const cloodyconfig = require('./config.json');
//------------------------------------------------------------------------------------------------//
const cloodybot = new Client({ intents: [Intents.FLAGS.GUILDS] });
const targetUserId = '882320290485510155';
const rest = new REST({ version: '9' }).setToken(cloodyconfig.token);
//------------------------------------------------------------------------------------------------//
const commands = [
    {
        name: 'server',
        description: 'informations  about server status',
    },
    {
        name: 'member',
        description: 'informations  about server players',
    },
    {
        name: 'team',
        description: 'informations  about server team staffs',
    },
    {
        name: 'information',
        description: 'say /information to see info server',
      },
];
//------------------------------------------------------------------------------------------------//



//------------------------------------------------------------------------------------------------//

cloodybot.once('ready', () => {
    console.log(`Logged: ${cloodybot.user.tag}`);

    setInterval(() => {
    cloodymta.query({
        type: 'mtasa',
        host: cloodyconfig.server_ip,
        port: cloodyconfig.server_port
    }).then((state) => {
        cloodybot.user.setActivity(`Players: [ ${state.raw.numplayers}/${state.maxplayers} ] `, { type: 'WATCHING' });
    }).catch(err => {
        console.log(err);
    });
}, 5000);


    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(cloodybot.user.id, cloodyconfig.guildId),
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
});

//------------------------------------------------------------------------------------------------//

cloodybot.on('interactionCreate', async cloodymsg => {
    if (!cloodymsg.isCommand()) return;

    const { commandName } = cloodymsg;

    if (commandName === 'server') {
        cloodymta.query({
            type: 'mtasa',
            host: cloodyconfig.server_ip,
            port: cloodyconfig.server_port
        }).then(async (state) => {
            console.log(state);
            const cloodyembed = new MessageEmbed()
                .setTitle(state.name)
                .setColor('#f5ff66')
                .addField('Map:', ` - ${state.map}`, true)
                .addField('Gametype:', ` - ${state.raw.gametype}`, true)
                .addField('Developers:',  `- /team ` , true)
                .addField('Player:', ` - ${state.raw.numplayers}/${state.maxplayers}`, true)
                .addField('Ping:', ` - ${state.ping}ms`, true)
                .addField('IP:', ` - ${state.connect}`, true)
                .setTimestamp()
                .setThumbnail('https://media.discordapp.net/attachments/1194330894358564944/1195054125046583356/Capture-removebg-preview.png?ex=65c50ce2&is=65b297e2&hm=f3609c1190e3699b4689963f9f6da35696e0088b0f0117a01b9ea952c7834964&=&format=webp&quality=lossless')
                .setFooter(`Requested by ${cloodymsg.member.user.tag}`, cloodymsg.member.user.avatarURL());

            await cloodymsg.reply({ embeds: [cloodyembed] });
        }).catch(err => {
            console.log(err);
        });


//------------------------------------------------------------------------------------------------//


    } else if (commandName === 'member') {
        cloodymta.query({
            type: 'mtasa',
            host: cloodyconfig.server_ip,
            port: cloodyconfig.server_port
        }).then(async (state) => {
            console.log(state);
            const players = state.players.map(p => p.name).join('\n');
            const cloodyembed = new MessageEmbed()
                .setTitle(state.name)
                .setColor('#f5ff66')
                .addField('Players name :', `\`\`\`${players}\`\`\``, true)
                .setTimestamp()
                .setThumbnail('https://media.discordapp.net/attachments/1194330894358564944/1195054125046583356/Capture-removebg-preview.png?ex=65c50ce2&is=65b297e2&hm=f3609c1190e3699b4689963f9f6da35696e0088b0f0117a01b9ea952c7834964&=&format=webp&quality=lossless')
                .setImage('https://media.discordapp.net/attachments/1194330894358564944/1198341607934673037/1.png?ex=65c7c817&is=65b55317&hm=5fc2f593c96750d9b53b300116ab562d5b7de787482395dc43043523323014da&=&format=webp&quality=lossless')
                .setFooter(`Requested by ${cloodymsg.member.user.tag}`, cloodymsg.member.user.avatarURL());

            await cloodymsg.reply({ embeds: [cloodyembed] });
        }).catch(err => {
            console.log(err);
        });
    }
});


//------------------------------------------------------------------------------------------------//


cloodybot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'team') {
        try {
            const cloodyembed = new MessageEmbed()
                .setTitle('Server Team Staff')
                .setColor('#f5ff66')
                .setDescription('List of server administrators and moderators:')
                .addField('Founders:', '- Isma3il.ben\n- Abdou.Blh\n', true)
                .addField('Admins:', '- Admin1\n- Admin2\n- Admin3', true)
                .addField('Moderators:', '- Mod1\n- Mod2\n- Mod3', true)
                .setTimestamp()
                .setThumbnail('https://media.discordapp.net/attachments/1194330894358564944/1195054125046583356/Capture-removebg-preview.png?ex=65c50ce2&is=65b297e2&hm=f3609c1190e3699b4689963f9f6da35696e0088b0f0117a01b9ea952c7834964&=&format=webp&quality=lossless')
                .setImage('https://media.discordapp.net/attachments/1194330894358564944/1198341607934673037/1.png?ex=65c7c817&is=65b55317&hm=5fc2f593c96750d9b53b300116ab562d5b7de787482395dc43043523323014da&=&format=webp&quality=lossless')
                .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.avatarURL());

            await interaction.reply({ embeds: [cloodyembed] });
        } catch (err) {
            console.error(err);
        }
    }
});



//------------------------------------------------------------------------------------------------//


cloodybot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
  
    const { commandName, user } = interaction;
  
    if (commandName === 'information' && user.id === targetUserId) {
      const embed = {
        title: 'Server Information',
        color: 16768613, 
        image:{
          url:'https://media.discordapp.net/attachments/1194330894358564944/1198341607934673037/1.png?ex=65c7c817&is=65b55317&hm=5fc2f593c96750d9b53b300116ab562d5b7de787482395dc43043523323014da&=&format=webp&quality=lossless&width=1025&height=77'
        },  
        fields: [
          {
            name: 'Management Team:',
            value: '> <:shieldquarter:1201237677136171008>丨**say \`\`/team\`\` to see them**',
            inline: true,
          },
          {
            name: 'Server Status:',
            value: '> <:online:1201229319905738802>丨**Online**',
            inline: true,
          },
          {
            name: 'Time of Restart:',
            value: '> <:endar:1201229523161722910>丨**Every day at**:<t:1704108600:T>',
  
          },
        
        ],
      
      };
  
      const row = {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: 'Read Rules',
            emoji: '<:bookss:1201236348623925389>',
            url: 'https://mixdzroleplay.netlify.app/rules',
          },
          {
            type: 2,
            style: 5,
            label: 'Our Website',
            emoji: '<:Word:1198364709200593006>',
            url: 'https://mixdzroleplay.netlify.app/', 
          },
          {
            type: 2,
            style: 5,
            label: ' Contact Support',
            emoji: '<:Click:1200431274129621012>',
            url: 'https://discord.com/channels/1194306643878498324/1194320997759856671', 
          },
        ],
      };
  
      await interaction.reply({ embeds: [embed], components: [row] });
    }
  });

cloodybot.login(cloodyconfig.token);
