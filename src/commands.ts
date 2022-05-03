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

class CommandManager {
    private discordToken: string;
    private discordClientId: string;

    private rest: REST;

    private reactCommand: { [name: string]: Command } = {};

    constructor() {

        if (!process.env.DISCORD_TOKEN) {
            throw new Error('DISCORD_TOKEN is not defined');
        }
        if (!process.env.DISCORD_CLIENT_ID) {
            throw new Error('DISCORD_CLIENT_ID is not defined');
        }

        this.discordToken = process.env.DISCORD_TOKEN;
        this.discordClientId = process.env.DISCORD_CLIENT_ID;

        importModules('./commands/', { fileExtensions: ['.ts'] });

        this.rest = new REST({ version: '10' }).setToken(this.discordToken);
    }

    addCommand(command: Command) {
        this.reactCommand[command.name] = command;
    }

    async onCommand(interaction: CommandInteraction) {
        const toDo = this.reactCommand[interaction.commandName];

        if (!toDo) {
            await interaction.reply('Command not found');
            return;
        }
        await toDo.cb(interaction);
    }

    async setGuildCommands(guildId: string) {
        const json = Object.keys(this.reactCommand).map(name => this.reactCommand[name].json);

        await this.rest.put(Routes.applicationGuildCommands(this.discordClientId, guildId), { body: json });
    }
}

export default new CommandManager();