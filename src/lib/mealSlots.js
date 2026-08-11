export const MEAL_SLOTS = [
  { id: "breakfast", label: "Breakfast", emoji: "🍳", color: "#FF6B35" },
  { id: "lunch", label: "Lunch", emoji: "🥪", color: "#FFD166" },
  { id: "dinner", label: "Dinner", emoji: "🍽️", color: "#EF476F" },
  { id: "snack1", label: "Snack 1", emoji: "🍎", color: "#06D6A0" },
  { id: "snack2", label: "Snack 2", emoji: "🍌", color: "#06D6A0" },
  { id: "sweet_treat", label: "Sweet Treat", emoji: "🍩", color: "#EF476F" },
];

export const getSlot = (id) => MEAL_SLOTS.find((s) => s.id === id) || MEAL_SLOTS[0];

export const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary (little/no exercise)", multiplier: 1.2 },
  { id: "light", label: "Light (1-3 days/week)", multiplier: 1.375 },
  { id: "moderate", label: "Moderate (3-5 days/week)", multiplier: 1.55 },
  { id: "active", label: "Active (6-7 days/week)", multiplier: 1.725 },
  { id: "very_active", label: "Very Active (hard exercise daily)", multiplier: 1.9 },
];