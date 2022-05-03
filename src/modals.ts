import { ModalSubmitInteraction } from 'discord.js';
import importModules from 'import-modules';

import Modal from './API/modal.api';

type ImportType = {[key: string]: {default: Modal}};

class ModalManager {
  private reactModal: { [name: string]: Modal } = {};

  constructor() {
    this.register();
  }

  register() {
    const importedModals = importModules('./modals/', { fileExtensions: ['.ts', '.js'] }) as ImportType;

    Object.keys(importedModals).forEach(name => {
      const modal = importedModals[name].default;
      this.reactModal[modal.name] = modal;
    });
  }

  async onReact(interaction: ModalSubmitInteraction) {
    const toDo = this.reactModal[interaction.customId];

    if (!toDo) {
      await interaction.reply('Modal not found');
      return;
    }
    await toDo.callBack(interaction);
  }
}

const modalManager = new ModalManager();

export default modalManager;