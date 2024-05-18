export async function action_collect_block(mcBot: any, mcData: any, parameters: any): Promise<[any, any]> {

    // Get the name or partial name of the block we want
    const { block_type } = parameters;

    // Loop through all blocks and find the ids that matches the name or partial name
    const searchIds = []
    for (let i = 0; i < Object.keys(mcData.blocks).length; i++) {
        if (mcData.blocks[i].name.includes(block_type)) {
            searchIds.push(mcData.blocks[i].id)
        }
    }

    // Use findBlocks to find the location of these nearby blocks.
    const foundBlocks = mcBot.findBlock({
        matching: searchIds,
        maxDistance: 64
    });

    var result = "Could not find blocks with name:" + block_type

    // Collect the blocks. 
    if (foundBlocks) {
        try {
          await mcBot.collectBlock.collect(foundBlocks);
          result = "Blocks collected."
        } catch (err) {
          console.error('Error collecting grass:', err);
          result = "Error collecting blocks."
        }
    }

    // Report back that we are done.
    const responseBody = { "Message": result };
    const responseState = 'REPROMPT';
    return [responseBody, responseState];
  }
  