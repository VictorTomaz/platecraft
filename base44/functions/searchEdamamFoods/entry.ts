import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Searches the USDA FoodData Central API (FDC), which supports true page-based
// pagination. Edamam's /parser endpoint hard-caps at ~20 results per query with
// no continuation, so it cannot back a "Load more" flow. The FDC key is stored
// in the FDC_API_KEY secret.
const PAGE_SIZE = 20;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const query = (body?.query || '').toString().trim();
    if (!query) {
      return Response.json({ foods: [], hasMore: false });
    }
    const page = Math.max(0, Number(body?.page) || 0);

    const apiKey = Deno.env.get('FDC_API_KEY');
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}`;
    // FDC pageNumber is 1-indexed (page=0 client maps to FDC pageNumber=1).
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        dataType: ['Foundation', 'SR Legacy', 'Survey (FNDDS)', 'Branded'],
        pageSize: PAGE_SIZE,
        pageNumber: page + 1,
      }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return Response.json(
        { error: `FDC API error (status ${res.status}): ${text.slice(0, 200)}` },
        { status: 500 }
      );
    }

    const totalHits = data.totalHits || 0;
    const foods = (data.foods || []).map((f) => {
      const n = {};
      (f.foodNutrients || []).forEach((nt) => {
        if (!nt.nutrientName) return;
        const name = nt.nutrientName.toLowerCase();
        const unit = (nt.unitName || '').toUpperCase();
        if (name === 'energy' && unit === 'KCAL') n.kcal = nt.value;
        if (name === 'protein') n.prot = nt.value;
        if (name === 'carbohydrate, by difference') n.carb = nt.value;
        if (name === 'total lipid (fat)') n.fat = nt.value;
      });

      // Branded foods report nutrients per the labeled serving size;
      // Foundation/SR Legacy/Survey report per 100g. We surface the matching
      // serving amount and the reported nutrient values directly so the
      // "X kcal / Y g" line shown to the user matches the source basis.
      const isBranded = f.dataType === 'Branded';
      const servingGrams = isBranded && f.servingSize ? f.servingSize : 100;

      return {
        name: f.description || f.lowercaseDescription || query,
        brand: f.brandOwner || '',
        serving_amount: Math.round(servingGrams),
        serving_unit: 'g',
        calories: Math.round(n.kcal || 0),
        protein: Math.round(n.prot || 0),
        carbs: Math.round(n.carb || 0),
        fats: Math.round(n.fat || 0),
        source: 'fdc',
      };
    });

    const hasMore = (page + 1) * PAGE_SIZE < totalHits;
    return Response.json({ foods, hasMore, totalHits });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});