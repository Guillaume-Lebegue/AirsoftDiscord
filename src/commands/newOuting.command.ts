import { CacheType, CommandInteraction } from 'discord.js';

import SlashCommand from '../API/appCommand.api';
import newOutingModal from '../modals/newOuting.modal';

class NewOutingCommand extends SlashCommand {

  constructor() {
    super('new_outing', 'Open modal for new airsoft outing')
  }

  public async callBack(interaction: CommandInteraction<CacheType>): Promise<void> {
    await interaction.showModal(newOutingModal.builder);
  }

}

export default new NewOutingCommand();