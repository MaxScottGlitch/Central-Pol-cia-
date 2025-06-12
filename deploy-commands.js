const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('solicitar')
    .setDescription('Solicitar cargo Polícia')
    .addStringOption(opt => opt.setName('nome').setDescription('Seu nome').setRequired(true))
    .addStringOption(opt => opt.setName('id').setDescription('Seu ID RP').setRequired(true))
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Registrando comandos...');
    await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      { body: commands }
    );
    console.log('✅ Comando registrado!');
  } catch (err) {
    console.error(err);
  }
})();
