const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');

export async function action_move_to_location(mcBot: any, mcData: any, parameters: any): Promise<[any, any]> {
  const { location_x, location_y, location_z } = parameters;

  console.log('location_x:', location_x);
  console.log('location_y:', location_y);
  console.log('location_z:', location_z);

  await mcBot.pathfinder.setGoal(new GoalNear(
    location_x,
    location_y,
    location_z,
    1
  ));

  const responseBody = { "message": "Moving to location, please wait." };
  const responseState = 'REPROMPT';
  return [responseBody, responseState];
}
