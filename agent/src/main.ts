import { BedrockBot } from './bedrock-bot';
import { MyFunctionHandler } from './function-handler';

const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');

const collectblock = require('mineflayer-collectblock').plugin;

function generateUuid(): string {
  // Generate a random hexadecimal string
  const randomHex = Math.random().toString(16).slice(2);
  // Construct the UUID pattern
  const uuid = `${randomHex.slice(0, 8)}-${randomHex.slice(8, 12)}-${randomHex.slice(12, 16)}-${randomHex.slice(16, 20)}-${randomHex.slice(20)}`;
  return uuid;
}

const mcBot = mineflayer.createBot({
  host: '127.0.0.1',
  username: 'Claude',
  auth: 'offline',
  port: 25565,
  version: "1.20.1"
});

const functionHandler = new MyFunctionHandler(mcBot);
const bedrockBot = new BedrockBot(functionHandler);

// Set the chat callback
bedrockBot.setChatCallback(handleChatMessage);

// Set the session ID to a random GUID
const uuid = generateUuid;
bedrockBot.setSessionId(uuid());

mcBot.once('spawn', initializeBot);
mcBot.on('chat', handleChatCommands);

// Chat callback implementation
function handleChatMessage(message: string) {
  console.log(`Received chat message: ${message}`);
  mcBot.chat(`${message}`)
}

function initializeBot() {
  mcBot.loadPlugin(pathfinder);
  mcBot.loadPlugin(collectblock);

  const defaultMove = new Movements(mcBot)
  defaultMove.allow1by1towers = true // Do not build 1x1 towers when going up
  defaultMove.canDig = true // Disable breaking of blocks when pathing 
  defaultMove.scafoldingBlocks.push(mcBot.registry.itemsByName['acacia_slab'].id) // Add nether rack to allowed scaffolding items
  mcBot.pathfinder.setMovements(defaultMove) // Update the movement instance pathfinder uses

  console.log('Bot spawned');
}

async function handleChatCommands(username: string, message: string) {

  mcBot.time = 6000

  if (username === mcBot.username) return;

  switch (message) {
    case 'reset':
      const uuid = generateUuid;
      bedrockBot.setSessionId(uuid());
      mcBot.chat('Session reset');
      break;

    default:
      const prompt = `${username} says: ${message}`;
      await bedrockBot.chatWithAgent(prompt);
  }

}