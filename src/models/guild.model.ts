import { Document, model, Model, Query, Schema } from 'mongoose';
import commands from '../commands';

const guildSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  guildName: {
    type: String,
    required: true,
  }
});

interface IGuild extends Document {
  guildId: string;
  guildName: string;
}

export interface GuildDocument extends IGuild {
  setCommands(): Promise<void>;
}

export interface GuildModel extends Model<GuildDocument> {
    findByGuildId(guildId: string): Query<GuildDocument | null, GuildDocument>;
    startup(): Promise<void>;
}

guildSchema.method('setCommands', async function (this: GuildDocument) {
  console.info(`-- Adding commands to guild '${this.guildName}:${this.guildId}'`);
  commands.setGuildCommands(this.guildId);
});

guildSchema.static('findByGuildId', function (this: Model<GuildDocument>, guildId: string): Query<GuildDocument | null, GuildDocument> {
  return this.findOne({ guildId });
});

guildSchema.static('startup', async function (this: Model<GuildDocument>) {
  const guilds = await this.find();

  for await (const guild of guilds) {
    await guild.setCommands();
  }
});

guildSchema.pre<GuildDocument>('save', async function (this: GuildDocument) {
  if (this.isNew) {
    console.info(`-- Joined a new guild: '${this.guildName}:${this.guildId}'`);
    await this.setCommands();
  }
});

guildSchema.pre<GuildDocument>('remove', async function (this: GuildDocument) {
  console.info(`-- Left a guild: '${this.guildName}:${this.guildId}'`);
});

const Guild = model<GuildDocument, GuildModel>('Guild', guildSchema);

export default Guild;