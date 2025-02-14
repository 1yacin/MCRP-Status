const { Client, GatewayIntentBits, ActivityType, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const express = require('express');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ],
});

const app = express();
const port = 3000;
app.get('/', (req, res) => {
  const imagePath = path.join(__dirname, 'index.html');
  res.sendFile(imagePath);
});
app.listen(port, () => {
  console.log('\x1b[36m[ SERVER ]\x1b[0m', '\x1b[32m SH : http://localhost:' + port + ' ✅\x1b[0m');
});

// Status system
const statusMessages = ["minexrp.net"];
const statusTypes = ['idle'];
let currentStatusIndex = 0;
let currentTypeIndex = 0;

// Bot bio text
const botBio = "I am a helpful bot that manages your server!";

// Function to update bot status
function updateStatus() {
  const currentStatus = statusMessages[currentStatusIndex];
  const currentType = statusTypes[currentTypeIndex];
  client.user.setPresence({
    activities: [{ name: currentStatus, type: ActivityType.Custom }],
    status: currentType,
  });
  console.log('\x1b[33m[ STATUS ]\x1b[0m', `Updated status to: ${currentStatus} (${currentType})`);
  currentStatusIndex = (currentStatusIndex + 1) % statusMessages.length;
  currentTypeIndex = (currentTypeIndex + 1) % statusTypes.length;
}

// Function to keep bot alive
function heartbeat() {
  setInterval(() => {
    console.log('\x1b[35m[ HEARTBEAT ]\x1b[0m', `Bot is alive at ${new Date().toLocaleTimeString()}`);
  }, 30000);
}

// Register commands (bio command)
client.once('ready', async () => {
  console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[34mPing: ${client.ws.ping} ms \x1b[0m`);
  updateStatus();
  setInterval(updateStatus, 10000);
  heartbeat();

  // Register bio command
  const commands = [
    new SlashCommandBuilder()
      .setName('bio')
      .setDescription('Displays the bot’s bio')
  ];
  
  try {
    await client.application.commands.set(commands);
    console.log('\x1b[32m[ COMMANDS ]\x1b[0m', 'Bio command registered successfully.');
  } catch (error) {
    console.error('\x1b[31m[ ERROR ]\x1b[0m', 'Failed to register commands:', error);
  }
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'bio') {
    await interaction.reply(botBio);
  }
});

// Login function
async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log('\x1b[36m[ LOGIN ]\x1b[0m', `\x1b[32mLogged in as: ${client.user.tag} ✅\x1b[0m`);
    console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[35mBot ID: ${client.user.id} \x1b[0m`);
    console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[34mConnected to ${client.guilds.cache.size} server(s) \x1b[0m`);
  } catch (error) {
    console.error('\x1b[31m[ ERROR ]\x1b[0m', 'Failed to log in:', error);
    process.exit(1);
  }
}

login();
