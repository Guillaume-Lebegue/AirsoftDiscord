import 'dotenv/config';
import { Client, IntentsBitField } from 'discord.js';

import connectDatabase from './service/db.service';
import commands from './commands';
import Guild from './models/guild.model';

(async () => {
  await connectDatabase();

  const client = new Client({ intents: [ IntentsBitField.Flags.Guilds ] });

  client.on('ready', () => {
    console.info(`- Logged in as ${client.user?.tag}!`);
    Guild.startup();
  });

  //joined a server
  client.on('guildCreate', async guild => {
    const newGuild = new Guild({
      guildId: guild.id,
      guildName: guild.name
    });
    await newGuild.save();
  });

  //removed from a server
  client.on('guildDelete', async guild => {
    if (!guild.available) return;
    const guildToDelete = await Guild.findByGuildId(guild.id);
    if (guildToDelete) await guildToDelete.remove();
  });

  client.on('interactionCreate', async interaction => {
    console.debug('New interaction: ', interaction.type);
    console.debug('is command: ', interaction.isCommand());
    if (interaction.isCommand()) {
      commands.onCommand(interaction);
      return;
    }

    if (interaction.isModalSubmit()) {
      console.debug('modal submit: ', interaction);
      interaction.reply('Modal submit');
      return;
    }

  });

  await client.login(process.env.DISCORD_TOKEN);
})();