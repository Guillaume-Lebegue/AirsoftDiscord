import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';
import importModules from 'import-modules';

export interface Command {
  name: string;
  json: unknown;
  cb: (interaction: CommandInteraction) => Promise<void>;
}

const discordToken = process.env.DISCORD_TOKEN;
const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordGuild = process.env.DISCORD_GUILD;

const reactCommand: { [name: string]: Command } = {};

export const addCommand = async (command: Command) => {
  reactCommand[command.name] = command;
}

export const onCommand = async (interaction: CommandInteraction) => {
  const toDo = reactCommand[interaction.commandName];

  if (!toDo) {
    await interaction.reply('Command not found');
    return;
  }
  await toDo.cb(interaction);
};

(async () => {
  if (!discordToken) {
    throw new Error('DISCORD_TOKEN is not defined');
  }
  if (!discordClientId) {
    throw new Error('DISCORD_CLIENT_ID is not defined');
  }

  if (!discordGuild) {
    throw new Error('DISCORD_GUILD is not defined');
  }

  importModules('./commands/', { fileExtensions: ['.ts'] });

  const rest = new REST({ version: '10' }).setToken(discordToken);

  const json = Object.keys(reactCommand).map(name => reactCommand[name].json);

  console.log('commands: ', reactCommand);
  console.log('json', json);
  const result = await rest.put(Routes.applicationGuildCommands(discordClientId, discordGuild), { body: json });
  console.log('result: ', result);
  console.log('Commands added to guild');
})();