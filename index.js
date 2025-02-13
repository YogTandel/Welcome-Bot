const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActivityType,
} = require("discord.js");
require("dotenv").config("./.env"); // Load environment variables from .env file

// Create a new client | Don't change the intents
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

process.on("unhandledRejection", (reason, promise) => {
  try {
    console.error(
      "Unhandled Rejection at: ",
      promise,
      "reason: ",
      reason.stack || reason
    );
  } catch {
    console.error(reason);
  }
});

// Emitted When member joined to the server
client.on("guildMemberAdd", async (member) => {
  // Ignore and Add a specific role to bot users
  if (member.user.bot) {
    member.roles.add(process.env.WELCOME_BOT_ROLE_ID); // Add role for bots
  } else {
    const welcomeChannel = member.guild.channels.cache.get(
      process.env.WELCOME_CHANNEL_ID
    );

    // Create a discord invite link from the entered welcome channel
    const welcomeInvitesLink = await welcomeChannel.createInvite({
      maxAge: 10 * 60 * 1000,
      maxUses: 100,
    });

    if (!welcomeChannel) {
      return console.log(
        "I can't find the welcome channel, Please set the channel ID in .env File"
      );
    }

    // DM Welcomer
    const welcomeDMEmbed = new EmbedBuilder()
      .setTitle(
        `Dear ${member.user.username}, Welcome to the **__${
          member.guild.name
        }__** [${member.guild.memberCount.toLocaleString()}]`
      )
      .setURL("https://discord.gg/pNnEUggtPA")
      .setDescription(
        process.env.DM_WELCOMER_DESCRIPTION || "No Data was filled out"
      )
      .setThumbnail(member.guild.iconURL({ size: 1024 }))
      .setColor("#cb9bfb")
      .setFooter({
        text: `Sent from: ${member.guild.name}`,
        iconURL: member.user.displayAvatarURL({ size: 1024 }),
      })
      .setTimestamp();

    // Add a banner if the server has one (boosted server)
    if (member.guild.bannerURL()) {
      welcomeDMEmbed.setImage(member.guild.bannerURL({ size: 1024 }));
    }

    // 4 Link Buttons
    const welcomeDMRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(process.env.DM_WELCOMER_LINK_BUTTON_FIRST_LABEL || "No Data")
        .setURL(
          process.env.DM_WELCOMER_LINK_BUTTON_FIRST_URL ||
            "https://discord.gg/pNnEUggtPA"
        )
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel(process.env.DM_WELCOMER_LINK_BUTTON_SECOND_LABEL || "No Data")
        .setURL(
          process.env.DM_WELCOMER_LINK_BUTTON_SECOND_URL ||
            "https://www.youtube.com/@gigigonemad"
        )
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel(process.env.DM_WELCOMER_LINK_BUTTON_THIRD_LABEL || "No Data")
        .setURL(
          process.env.DM_WELCOMER_LINK_BUTTON_THIRD_URL ||
            "https://www.instagram.com/gigigonemad"
        )
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel(process.env.DM_WELCOMER_LINK_BUTTON_FOURTH_LABEL || "No Data")
        .setURL(
          process.env.DM_WELCOMER_LINK_BUTTON_FOURTH_URL ||
            "https://guns.lol/gigigonemad"
        )
        .setStyle(ButtonStyle.Link)
    );

    // Send the Information to the member's DM
    member
      .send({
        content: `** ${welcomeInvitesLink} **`,
        embeds: [welcomeDMEmbed],
        components: [welcomeDMRow],
      })
      .catch(() => {
        console.error(
          `Discord API error: Cannot send messages to ${member.user.username}'s DM, it seems that this member has closed his DM\nBut other actions are running now!`
        );
      });

    // Welcome in the Specific channel
    const welcomeEmbed = new EmbedBuilder()
      .setAuthor({
        name: `Hello ${member.user.username}, Welcome to the ${
          member.guild.name
        } [${member.guild.memberCount.toLocaleString()}]`,
        iconURL: member.user.displayAvatarURL({ size: 1024 }),
      })
      .setTitle(
        `<a:flowers:1181494892787150969> Hey ${member.user.username}! Thanks for joining Gigi's official Discord server <a:flowers:1181494892787150969>`
      )
      .setDescription(
        [
          "**Kindly Checkout-**\n1️⃣ **__Check the Rules__**: **Head over to <#1157041468242919496>⁠⁠ to read and follow our community guidelines.** <:5128ban:1197833118137188423> \n2️⃣ **__Chat Away__**: **Use <#1157041468242919501> ⁠for all your friendly conversations!** <a:chat:1181493995583590460>\n3️⃣ **__Self roles__** : **Select your roles in** <#1157041468242919498> <:pepewow:1157104051436146829>\n4️⃣ **__color roles__** : **Get your Fav color in** <#1308486883407302677> <a:RainbowPuke:1308709971373985832>\n\n<a:cat:1197853268265685012> **Enjoy your stay, Let's create a friendly and inviting atmosphere for everyone here!** <a:cat:1197853268265685012>",
        ].join("\n")
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setImage(
        "https://media.discordapp.net/attachments/1157041469379596430/1181531598378778684/WELCOME_1.gif?ex=678e1b0c&is=678cc98c&hm=9c1b85637188b547ee7ea0473e368988b6088cd5723df65b46b2bdead02741e7&"
      )
      .setColor("#cb9bfb")
      .setFooter({
        text: "Have a good day ahead <<3",
        iconURL: member.guild.iconURL({ size: 1024 }),
      })
      .setTimestamp();

    const welcomeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(process.env.WELCOME_CHANNEL_LINK_BUTTON_LABEL || "No Data")
        .setEmoji("<a:cutecat:1197853322036658266>")
        .setURL(
          process.env.WELCOME_CHANNEL_LINK_BUTTON_URL ||
            "https://discord.gg/pNnEUggtPA"
        )
        .setStyle(ButtonStyle.Link)
    );

    // Send the Embed Message to your welcome channel
    welcomeChannel.send({
      content: `${member}`,
      embeds: [welcomeEmbed],
      components: [welcomeRow],
    });

    // Auto joined role (Only for Real human users)
    member.roles.add(process.env.WELCOME_ROLE_ID).catch(() => {
      console.error(
        `Cannot add this joined role to the ${member.user.username}\nMake sure the role ID that entered in the config.json file is correct and I have enough permissions`
      );
    });
  }

  // Welcomer Log messages (Includes some member's Information)
  const memberValidation = member.user.bot ? "Application Bot" : "Member";
  const welcomeLogChannel = client.channels.cache.get(
    process.env.WELCOME_LOG_CHANNEL_ID
  );

  if (!welcomeLogChannel) {
    return console.log(
      "I can't find the welcome channel log, Please make sure to set the welcomeChannelId in config.json file"
    );
  }

  const welcomeLogEmbed = new EmbedBuilder()
    .setAuthor({
      name: `NEW ${memberValidation} was Joined`,
      iconURL: `${member.user.displayAvatarURL({ size: 1024 })}`,
    })
    .setDescription(
      `**${member} | ${
        member.user.tag
      } | ${member.guild.memberCount.toLocaleString()} Members**`
    )
    .addFields(
      {
        name: `Badges:`,
        value: `${member.user.flags.toArray().join(", ") || "No Badges"}`,
        inline: false,
      },
      {
        name: `Account Created at:`,
        value: `<t:${Math.round(
          member.user.createdTimestamp / 1000
        )}:f> | <t:${Math.round(member.user.createdTimestamp / 1000)}:R>`,
        inline: false,
      },
      {
        name: `Joined Server at:`,
        value: `<t:${Math.round(
          member.joinedTimestamp / 1000
        )}:f> | <t:${Math.round(member.joinedTimestamp / 1000)}:R>`,
        inline: false,
      }
    )
    .setThumbnail(`${member.user.displayAvatarURL({ size: 1024 })}`)
    .setColor("32ff81")
    .setFooter({
      text: `ID: ${member.user.id}`,
      iconURL: member.guild.iconURL({ size: 1024 }),
    })
    .setTimestamp();

  welcomeLogChannel.send({ embeds: [welcomeLogEmbed] });

  // Ping On Join System (Mention your member to this channel when joined)
  const pingOnJoinChannel = client.channels.cache.get(
    process.env.PING_ON_JOIN_CHANNEL_ID
  );

  if (!pingOnJoinChannel) {
    return console.log(
      "I was unable to find your ping on join channel, make sure to set the 'pingOnChannelId' in the config.json file"
    );
  }

  pingOnJoinChannel
    .send({
      content: `Yooooo , <a:cutecat:1197853322036658266> ${member} just joined! `,
    })
    .then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 30000); // Delete the ping on join content after 30 seconds
    })
    .catch((err) => {
      console.log(
        `An error occurred while pinging this member: ${member.user.username} to the ${pingOnJoinChannel.name} channel\nCurrent Error can be found here: ${err}`
      );
    });
});

// When the client is ready
client.on("ready", async () => {
  const memberCountVoiceChannel = client.channels.cache.get(
    process.env.DISPLAY_MEMBER_COUNT_VOICE_CHANNEL_ID
  );

  client.user.setPresence({
    status: process.env.BOT_STATUS || "online",
    activities: [
      {
        name: process.env.BOT_ACTIVITY_NAME || "No Data was filled out",
        type: ActivityType.Listening,
      },
    ],
  });

  const ms = 900000;
  if (ms < 360000) {
    console.log(
      "Be careful, according to the Discord API TOS, the minimum time required to edit a channel is every 6 minutes, so please make your time more than 360,000 milliseconds."
    );
  }

  setInterval(() => {
    memberCountVoiceChannel.setName(
      `👥〢Members: ${memberCountVoiceChannel.guild.memberCount}`
    );
  }, ms);

  console.log(
    `${client.user.username} is now online and enjoying your advanced welcomer!⭐\nTotal Server: ${client.guilds.cache.size}`
  );
});

// Logged in to your Client
client.login(process.env.BOT_TOKEN);
