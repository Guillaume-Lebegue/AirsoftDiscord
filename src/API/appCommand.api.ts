import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import AReact from './react.api';

export default abstract class AppCommand extends AReact {

  protected readonly builder: SlashCommandBuilder;

  constructor(name: string, description: string) {
    super(name);
    this.builder = new SlashCommandBuilder().setName(name).setDescription(description);
  }

  abstract callBack(interaction: CommandInteraction): Promise<void>;

  public getDiscordJsonBuilder(): unknown {
    const json = this.builder.toJSON();
    return json;
  }

}