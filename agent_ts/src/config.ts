/**
 * Agent Config 
 * 
 * Loads in config values from environment variables else uses default values
 * Also discovers the id of the latest agent alias given an Amazon Bedrock Agent.
 * 
 */

import { BedrockAgentClient, ListAgentAliasesCommand } from "@aws-sdk/client-bedrock-agent"; // ES Modules import

import axios from 'axios';

export interface Config {

    mcHost: string;
    mcUsername: string;
    mcAuth: string;
    mcPort: number;
    mcVersion: string;
  
    agentId: string;
    agentAliasId: string;
  
  }

  // NOT GETTING THE VALUES YOU EXPECT? SEE THE ORDER OF CONFIG LOAD:
  // 1. Environment variables
  // 2. .env file
  // 3. Default values here...

  export const loadConfig = async (): Promise<Config> => {
    const config: Config = {
      mcHost: process.env.MC_HOST || '127.0.0.1',
      mcUsername: process.env.MC_USERNAME || 'Claude',
      mcAuth: process.env.MC_AUTH || 'offline',
      mcPort: parseInt(process.env.MC_PORT || '25565', 10),
      mcVersion: process.env.MC_VERSION || "1.20.1",
      agentId: process.env.AGENT_ID || "123123",
      agentAliasId: process.env.AGENT_ALIAS_ID || "123123"
    //   agentAliasId: '',
    };
  
    // config.agentAliasId = process.env.AGENT_ALIAS_ID || await getLatestAgentAliasId(config.agentId);
  
    return config;
  };

//   const getLatestAgentAliasId = async (agentId: string): Promise<string> => {
//     const client = new BedrockAgentClient({ region: 'us-west-2' });
//     const input = {
//       agentId: agentId,
//     };
//     const command = new ListAgentAliasesCommand(input);
//     const response = await client.send(command);
  
//     // Filter the agentAliasSummaries to get only the aliases with status "PREPARED"
//     const preparedAliases = response.agentAliasSummaries?.filter(
//       (alias) => alias.agentAliasStatus === 'PREPARED'
//     );
  
//     if (preparedAliases && preparedAliases.length > 0) {
//       // Sort the prepared aliases by the createdAt timestamp in descending order
//       preparedAliases.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  
//       // Return the ID of the most recent prepared alias
//       return preparedAliases[0].agentAliasId!;
//     }
  
//     throw new Error('No prepared agent alias found.');
//   };

