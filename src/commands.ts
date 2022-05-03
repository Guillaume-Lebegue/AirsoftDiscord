import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';
import importModules from 'import-modules';
import AppCommand from './API/appCommand.api';

type ImportType = {[key: string]: {default: AppCommand}};

class CommandManager {
  private discordToken: string;
  private discordClientId: string;

  private rest: REST;

  private reactCommand: { [name: string]: AppCommand } = {};

  constructor() {

    if (!process.env.DISCORD_TOKEN) {
      throw new Error('DISCORD_TOKEN is not defined');
    }
    if (!process.env.DISCORD_CLIENT_ID) {
      throw new Error('DISCORD_CLIENT_ID is not defined');
    }

    this.discordToken = process.env.DISCORD_TOKEN;
    this.discordClientId = process.env.DISCORD_CLIENT_ID;

    this.rest = new REST({ version: '10' }).setToken(this.discordToken);

    this.register();
  }

  register() {
    const importedCommands = importModules('./commands/', { fileExtensions: ['.ts', '.js'] }) as ImportType;

    Object.keys(importedCommands).forEach(name => {
      const cmd = importedCommands[name].default;
      this.reactCommand[cmd.name] = cmd;
    });
  }

  async onCommand(interaction: CommandInteraction) {
    const toDo = this.reactCommand[interaction.commandName];

    if (!toDo) {
      await interaction.reply('Command not found');
      return;
    }
    await toDo.callBack(interaction);
  }

  async setGuildCommands(guildId: string) {
    const json = Object.keys(this.reactCommand).map(name => this.reactCommand[name].getDiscordJsonBuilder());

    await this.rest.put(Routes.applicationGuildCommands(this.discordClientId, guildId), { body: json });
  }
}

const commandManager = new CommandManager();

export default commandManager;