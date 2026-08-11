import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const mealSlot = body.meal_slot && ['breakfast', 'lunch', 'dinner'].includes(body.meal_slot) ? body.meal_slot : null;
    if (!mealSlot) {
      return Response.json({ error: 'Please select breakfast, lunch, or dinner.' }, { status: 400 });
    }

    const [goals, slotMeals] = await Promise.all([
      base44.entities.CalorieGoal.filter({ is_active: true }, '-created_date', 1),
      base44.entities.MealEntry.filter({ meal_slot: mealSlot }, '-date', 100),
    ]);

    const goal = goals[0];
    if (!goal) {
      return Response.json({ error: 'No active calorie goal found. Please use the Calorie Calculator first.' }, { status: 400 });
    }

    if (!slotMeals || slotMeals.length === 0) {
      return Response.json({ error: `No previously logged ${mealSlot} foods found. Please log some ${mealSlot} meals first.` }, { status: 400 });
    }

    // Build a unique list of foods previously logged for this meal slot, using their base (per-serving) nutrition.
    const uniqueFoods = new Map();
    for (const m of slotMeals) {
      if (!uniqueFoods.has(m.food_name)) {
        uniqueFoods.set(m.food_name, {
          name: m.food_name,
          serving_amount: m.serving_amount,
          serving_unit: m.serving_unit,
          calories: m.base_calories,
          protein: m.base_protein,
          carbs: m.base_carbs,
          fats: m.base_fats,
        });
      }
    }
    const foodsList = Array.from(uniqueFoods.values());

    // Categorize each food by its dominant macronutrient, same logic used in the Meal Builder.
    const getMacroCategory = (food) => {
      const max = Math.max(food.protein || 0, food.carbs || 0, food.fats || 0);
      if (max === (food.protein || 0)) return 'protein';
      if (max === (food.carbs || 0)) return 'carbs';
      return 'fats';
    };
    const proteinFoods = foodsList.filter((f) => getMacroCategory(f) === 'protein').map((f) => f.name);
    const carbFoods = foodsList.filter((f) => getMacroCategory(f) === 'carbs').map((f) => f.name);
    const fatFoods = foodsList.filter((f) => getMacroCategory(f) === 'fats').map((f) => f.name);

    const varietySeed = typeof body.variety_seed === 'number' ? body.variety_seed : Math.random();

    const macroCoverageInstruction = `The meal must include at least one food whose dominant macro is protein, at least one whose dominant macro is carbs, and at least one whose dominant macro is fats — but ONLY from the categories that actually have foods available below; never invent a food to fill a category that has none.
- Protein-dominant foods available: ${proteinFoods.length > 0 ? JSON.stringify(proteinFoods) : 'none available'}
- Carb-dominant foods available: ${carbFoods.length > 0 ? JSON.stringify(carbFoods) : 'none available'}
- Fat-dominant foods available: ${fatFoods.length > 0 ? JSON.stringify(fatFoods) : 'none available'}`;

    const prompt = `You are a nutrition assistant. Generate 1 meal idea for ${mealSlot} using ONLY the foods listed below, which the user has previously logged for ${mealSlot}. Combine one or more of these foods (with a serving quantity/multiplier of the food's base serving) to closely match the user's target macronutrients for this meal. Randomization seed: ${varietySeed} — use this to pick a different, varied combination and portions than you might otherwise default to, so repeated requests produce different results.

${macroCoverageInstruction}

User's daily targets:
- Calories: ${goal.daily_calorie_target}
- Protein: ${goal.protein_target}g
- Carbs: ${goal.carbs_target}g
- Fats: ${goal.fats_target}g

This single ${mealSlot} meal should target roughly 1/3 of the daily targets, i.e. approximately ${Math.round(goal.daily_calorie_target / 3)} calories, ${Math.round(goal.protein_target / 3)}g protein, ${Math.round(goal.carbs_target / 3)}g carbs, and ${Math.round(goal.fats_target / 3)}g fats. Choose gram amounts for each food (fractional multipliers of the base serving are fine, e.g. 1.5x or 0.75x) so the meal's totals land as close as possible to these per-meal targets.

Foods previously logged for ${mealSlot} (name, base serving, and base nutrition per that serving):
${JSON.stringify(foodsList)}

For each food used in the meal, compute serving_amount and serving_unit as the ACTUAL gram/unit amount to eat (base serving_amount multiplied by the chosen multiplier), and calories/protein/carbs/fats scaled accordingly to that actual amount. Return totals for the meal that are the sum of its foods' scaled nutrition, and make sure those totals closely match the per-meal targets above.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          meals: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                foods: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      food_name: { type: 'string' },
                      serving_amount: { type: 'number' },
                      serving_unit: { type: 'string' },
                      calories: { type: 'number' },
                      protein: { type: 'number' },
                      carbs: { type: 'number' },
                      fats: { type: 'number' },
                    },
                    required: ['food_name', 'serving_amount', 'serving_unit', 'calories', 'protein', 'carbs', 'fats'],
                  },
                },
                total_calories: { type: 'number' },
                total_protein: { type: 'number' },
                total_carbs: { type: 'number' },
                total_fats: { type: 'number' },
              },
              required: ['name', 'foods', 'total_calories', 'total_protein', 'total_carbs', 'total_fats'],
            },
          },
        },
        required: ['meals'],
      },
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});