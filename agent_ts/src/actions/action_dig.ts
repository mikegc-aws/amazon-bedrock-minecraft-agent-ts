export async function action_dig(mcBot: any, mcData: any, parameters: any): Promise<[any, any]> {
  const { depth, width } = parameters;

  console.log('Depth:', depth);
  console.log('Width:', width);

  mcBot.entity.pitch = -1; // Look down...
  const block = mcBot.blockAtCursor(256); // Retrieve the block that the bot is currently targeting

  console.log('Target block:', block.name);

  try {
    for (let y = 0; y > -depth; y--) {
      for (let x = -width; x <= width; x++) {
        for (let z = -width; z <= width; z++) {
          if (x * x + z * z <= width * width) {
            const targetBlock = mcBot.blockAt(block.position.offset(x, y, z));

            console.log('Target block:', targetBlock.position);

            if (targetBlock && targetBlock.diggable) {
              await mcBot.dig(targetBlock);
            } else {
              console.log('Block not found or not diggable:', targetBlock.name);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error during circle digging operation:', err);
  }

  const responseBody = { "message": "Done digging." };
  const responseState = 'REPROMPT';
  return [responseBody, responseState];
}
