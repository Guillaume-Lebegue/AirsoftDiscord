import { ActionRowBuilder, TextInputBuilder } from '@discordjs/builders';
import { ModalSubmitInteraction, TextInputStyle } from 'discord.js';
import Modal from '../API/modal.api';

class NewOutingModal extends Modal {
  constructor() {
    super('new_outing_modal', 'Create a new airsoft outing');

    this.createInterface();
  }

  private createInterface(): void {
    const testInput1 = new TextInputBuilder().setLabel('test input 2').setCustomId('test-input-2').setRequired(true).setStyle(TextInputStyle.Short);

    const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents([testInput1]);

    this.builder.addComponents([row1]);
  }

  public async callBack(interaction: ModalSubmitInteraction): Promise<void> {
    interaction.reply('not implemented yet');
  }
}

export default new NewOutingModal();