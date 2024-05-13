"use strict";
/**
 * Agent Config
 *
 * Loads in config values from environment variables else uses default values
 * Also discovers the id of the latest agent alias given an Amazon Bedrock Agent.
 *
 */
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
exports.loadConfig = void 0;
const client_bedrock_agent_1 = require("@aws-sdk/client-bedrock-agent"); // ES Modules import
const loadConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        mcHost: process.env.MC_HOST || '172.0.0.1',
        mcUsername: process.env.MC_USERNAME || 'Claude',
        mcAuth: process.env.MC_AUTH || 'offline',
        mcPort: parseInt(process.env.MC_PORT || '25565', 10),
        mcVersion: process.env.MC_VERSION || "1.20.1",
        agentId: process.env.AGENT_ID || "DEHCT5KPAE",
        agentAliasId: '',
    };
    config.agentAliasId = process.env.AGENT_ALIAS_ID || (yield getLatestAgentAliasId(config.agentId));
    return config;
});
exports.loadConfig = loadConfig;
const getLatestAgentAliasId = (agentId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const client = new client_bedrock_agent_1.BedrockAgentClient({ region: 'us-west-2' });
    const input = {
        agentId: agentId,
    };
    const command = new client_bedrock_agent_1.ListAgentAliasesCommand(input);
    const response = yield client.send(command);
    // Filter the agentAliasSummaries to get only the aliases with status "PREPARED"
    const preparedAliases = (_a = response.agentAliasSummaries) === null || _a === void 0 ? void 0 : _a.filter((alias) => alias.agentAliasStatus === 'PREPARED');
    if (preparedAliases && preparedAliases.length > 0) {
        // Sort the prepared aliases by the createdAt timestamp in descending order
        preparedAliases.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        // Return the ID of the most recent prepared alias
        return preparedAliases[0].agentAliasId;
    }
    throw new Error('No prepared agent alias found.');
});
// Usage
// const config = await loadConfig();
// console.log('MC Host:', config.mcHost);
// console.log('MC Username:', config.mcUsername);
// ... Log other configuration values
