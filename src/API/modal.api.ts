import { ModalBuilder, ModalSubmitInteraction } from 'discord.js';
import AReact from './react.api';

export default abstract class Modal extends AReact {

  public readonly builder: ModalBuilder;

  constructor(name: string, title: string) {
    super(name);
    this.builder = new ModalBuilder().setCustomId(name).setTitle(title);
  }

  abstract callBack(interaction: ModalSubmitInteraction): Promise<void>;

}