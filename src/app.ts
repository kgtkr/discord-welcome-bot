import * as Discord from "discord.js";
import * as fs from "fs";

const config: {
  token: string;
  roles: string[];
  welcomeMsg: string;
  conformMsg: string;
} = JSON.parse(fs.readFileSync("config.json", { encoding: "utf8" }));
const client = new Discord.Client();

client.on("ready", () => {});

client.on("message", async (message) => {
  try {
    if (message.type === "GUILD_MEMBER_JOIN") {
      const msg = await message.reply(config.welcomeMsg);
      await msg.react("👍");
    }
  } catch (e) {
    console.error(e);
  }
});

client.on("messageReactionAdd", async (messageReaction, user) => {
  try {
    if (
      messageReaction.message.author.id === client.user?.id &&
      messageReaction.message.content.includes(`<@${user.id}>`)
    ) {
      const member = (
        await messageReaction.message.guild?.members.fetch()
      )?.find((member) => member.user.id === user.id);
      if (member !== undefined) {
        let newMember = false;
        for (const role of config.roles) {
          if (!member.roles.cache.has(role)) {
            await member.roles.add(role);
            newMember = true;
          }
        }

        if (newMember) {
          await messageReaction.message.channel.send(
            `<@${user.id}>${config.conformMsg}`
          );
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
});

client.login(config.token);
