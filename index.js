/* eslint-disable brace-style */
/* eslint-disable indent */

const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { token } = require("./config.json");

const colors = require("colors");
colors.enable();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const generalCommandsPath = path.join(__dirname, "commands", "general");
const generalCommandFiles = fs
  .readdirSync(generalCommandFiles)
  .filter((file) => file.endsWith(".js"));
for (const file of generalCommandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        .red
    );
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith("js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);
