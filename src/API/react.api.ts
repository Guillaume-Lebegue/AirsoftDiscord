import { Interaction } from 'discord.js';

export default abstract class AReact {
  
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  public abstract callBack(interaction: Interaction): Promise<void>;
}