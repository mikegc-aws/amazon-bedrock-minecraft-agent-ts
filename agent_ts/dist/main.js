"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bedrock_bot_1 = require("./bedrock-bot");
const function_handler_1 = require("./function-handler");
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');
const collectblock = require('mineflayer-collectblock').plugin;
function generateUuid() {
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
const functionHandler = new function_handler_1.MyFunctionHandler(mcBot);
const bedrockBot = new bedrock_bot_1.BedrockBot(functionHandler);
// Set the chat callback
bedrockBot.setChatCallback(handleChatMessage);
// Set the session ID to a random GUID
const uuid = generateUuid;
bedrockBot.setSessionId(uuid());
mcBot.once('spawn', initializeBot);
mcBot.on('chat', handleChatCommands);
// Chat callback implementation
function handleChatMessage(message) {
    console.log(`Received chat message: ${message}`);
    mcBot.chat(`${message}`);
}
function initializeBot() {
    mcBot.loadPlugin(pathfinder);
    mcBot.loadPlugin(collectblock);
    const defaultMove = new Movements(mcBot);
    defaultMove.allow1by1towers = true; // Do not build 1x1 towers when going up
    defaultMove.canDig = true; // Disable breaking of blocks when pathing 
    defaultMove.scafoldingBlocks.push(mcBot.registry.itemsByName['acacia_slab'].id); // Add nether rack to allowed scaffolding items
    mcBot.pathfinder.setMovements(defaultMove); // Update the movement instance pathfinder uses
    console.log('Bot spawned');
}
function handleChatCommands(username, message) {
    return __awaiter(this, void 0, void 0, function* () {
        mcBot.time = 6000;
        if (username === mcBot.username)
            return;
        switch (message) {
            case 'reset':
                const uuid = generateUuid;
                bedrockBot.setSessionId(uuid());
                mcBot.chat('Session reset');
                break;
            default:
                const prompt = `${username} says: ${message}`;
                yield bedrockBot.chatWithAgent(prompt);
        }
    });
}
