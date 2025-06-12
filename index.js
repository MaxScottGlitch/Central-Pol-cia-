const { Client, GatewayIntentBits, Partials, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel],
});

client.once('ready', () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  // /solicitar
  if (interaction.isChatInputCommand() && interaction.commandName === 'solicitar') {
    const nome = interaction.options.getString('nome');
    const id = interaction.options.getString('id');
    const canal = await client.channels.fetch(process.env.CANAL_ID);
    if (!canal) return interaction.reply({ content: 'Canal não encontrado.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('📥 Nova Solicitação de Cargo')
      .setDescription(`**Usuário:** ${interaction.user}\n**Nome:** ${nome}\n**ID:** ${id}\n**Patente:** Recruta`)
      .setColor('Blue')
      .setTimestamp();

    const aprovar = new ButtonBuilder()
      .setCustomId(`aprovar_${interaction.user.id}_${nome}_${id}`)
      .setLabel('✅ Aprovar')
      .setStyle(ButtonStyle.Success);
    const rejeitar = new ButtonBuilder()
      .setCustomId(`rejeitar_${interaction.user.id}`)
      .setLabel('❌ Rejeitar')
      .setStyle(ButtonStyle.Danger);
      
    await canal.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(aprovar, rejeitar)] });
    await interaction.reply({ content: '📨 Seu pedido foi enviado!', ephemeral: true });
  }

  // @{aprove}
  if (interaction.isButton()) {
    const [action, userId, nome, id] = interaction.customId.split('_');
    if (action === 'aprovar') {
      const membro = await interaction.guild.members.fetch(userId).catch(() => null);
      const cargo = interaction.guild.roles.cache.find(r => r.name === 'POLÍCIA');

      if (!membro || !cargo) {
        return interaction.reply({ content: 'Erro: usuário ou cargo não encontrado.', ephemeral: true });
      }

      await membro.roles.add(cargo);
      await membro.setNickname(`Recruta | ${nome} | ${id}`);

      await interaction.update({ content: `✅ Pedido aprovado por ${interaction.user}!`, embeds: [], components: [] });
      await interaction.followUp({ content: `👮 Cargo POLÍCIA dado a ${membro}`, ephemeral: false });
    }
    if (action === 'rejeitar') {
      await interaction.update({ content: `❌ Pedido rejeitado por ${interaction.user}`, embeds: [], components: [] });
    }
  }
});

client.login(process.env.BOT_TOKEN);
