import 'dotenv/config';
import { Client } from 'discord.js';

import { onCommand } from './commands';

const client = new Client({ intents: [] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async interaction => {
  console.log(`New interaction: `, interaction.type);
  console.log('is command: ', interaction.isCommand());
  if (interaction.isCommand()) {
    onCommand(interaction);
    return;
  }

  if (interaction.isModalSubmit()) {
    console.log('modal submit: ', interaction);
    interaction.reply('Modal submit');
    return;
  }

});

client.login(process.env.DISCORD_TOKEN);