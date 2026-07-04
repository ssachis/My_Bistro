// Curated recipe database with dietary tags, preparation steps, ingredients, unit costs, and substitution maps.

export const recipes = [
  // --- BREAKFASTS ---
  {
    id: 'breakfast_avo_toast',
    name: 'Avocado Toast with Poached Egg',
    mealType: 'breakfast',
    prepTime: 10,
    costPerServing: 3.20,
    description: 'Crispy toasted bread topped with rich mashed avocado, a runny poached egg, and red pepper flakes.',
    tags: ['Vegetarian', 'Dairy-Free'],
    ingredients: [
      { id: 'sourdough_bread', name: 'Sourdough Bread', amount: '1 slice', cost: 0.50, category: 'Bakery', substitutionId: 'bread' },
      { id: 'avocado', name: 'Avocado', amount: '0.5', cost: 1.20, category: 'Produce' },
      { id: 'egg', name: 'Egg', amount: '1', cost: 0.30, category: 'Dairy/Eggs', substitutionId: 'egg' },
      { id: 'cherry_tomatoes', name: 'Cherry Tomatoes', amount: '50g', cost: 0.80, category: 'Produce' },
      { id: 'olive_oil_seasoning', name: 'Olive Oil & Red Pepper Flakes', amount: '1 tsp', cost: 0.40, category: 'Pantry' }
    ],
    steps: [
      { action: 'Mash avocado with salt, pepper, and a splash of lemon juice', duration: 3, stage: 'prep' },
      { action: 'Toast the bread slice until crispy and golden brown', duration: 2, stage: 'cook' },
      { action: 'Poach the egg in gently simmering water with a dash of vinegar for 3-4 minutes', duration: 4, stage: 'cook' },
      { action: 'Assemble: Spread avocado on toast, top with sliced poached egg, halved cherry tomatoes, and red pepper flakes', duration: 1, stage: 'assemble' }
    ]
  },
  {
    id: 'breakfast_keto_pancakes',
    name: 'Keto Almond Flour Pancakes',
    mealType: 'breakfast',
    prepTime: 15,
    costPerServing: 4.80,
    description: 'Fluffy, low-carb pancakes made with almond flour, served with butter and sugar-free syrup.',
    tags: ['Keto', 'Gluten-Free', 'Vegetarian'],
    ingredients: [
      { id: 'almond_flour', name: 'Almond Flour', amount: '50g', cost: 1.50, category: 'Pantry' },
      { id: 'egg', name: 'Egg', amount: '2', cost: 0.60, category: 'Dairy/Eggs', substitutionId: 'egg' },
      { id: 'almond_milk', name: 'Almond Milk', amount: '50ml', cost: 0.30, category: 'Dairy/Eggs' },
      { id: 'butter', name: 'Butter', amount: '15g', cost: 0.50, category: 'Dairy/Eggs', substitutionId: 'butter' },
      { id: 'erythritol_sweetener', name: 'Erythritol Sweetener', amount: '1 tbsp', cost: 0.40, category: 'Pantry' },
      { id: 'sugar_free_syrup', name: 'Sugar-free Maple Syrup', amount: '2 tbsp', cost: 1.50, category: 'Pantry' }
    ],
    steps: [
      { action: 'Whisk the almond flour, eggs, almond milk, and erythritol in a bowl until smooth', duration: 4, stage: 'prep' },
      { action: 'Melt a dab of butter in a non-stick skillet over medium-low heat', duration: 2, stage: 'cook' },
      { action: 'Pour batter into small rounds and cook until bubbles form, then flip and cook for another 2 minutes', duration: 7, stage: 'cook' },
      { action: 'Serve warm stacked high with butter and sugar-free maple syrup drizzled on top', duration: 2, stage: 'assemble' }
    ]
  },
  {
    id: 'breakfast_chia_pudding',
    name: 'Berry Coconut Chia Pudding',
    mealType: 'breakfast',
    prepTime: 5,
    costPerServing: 2.90,
    description: 'Creamy coconut milk-infused chia pudding topped with fresh, vibrant mixed berries.',
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free'],
    ingredients: [
      { id: 'chia_seeds', name: 'Chia Seeds', amount: '3 tbsp', cost: 0.90, category: 'Pantry' },
      { id: 'coconut_milk', name: 'Coconut Milk', amount: '150ml', cost: 1.00, category: 'Pantry' },
      { id: 'maple_syrup', name: 'Maple Syrup', amount: '1 tbsp', cost: 0.50, category: 'Pantry' },
      { id: 'berries', name: 'Mixed Berries', amount: '50g', cost: 0.50, category: 'Produce' }
    ],
    steps: [
      { action: 'Stir chia seeds, coconut milk, and maple syrup vigorously in a glass jar', duration: 2, stage: 'prep' },
      { action: 'Let sit for 5 minutes, then stir again to break up any seed clumps', duration: 1, stage: 'prep' },
      { action: 'Chill in refrigerator to set (usually prepped night before or morning of)', duration: 1, stage: 'prep' },
      { action: 'Top with fresh blueberries and sliced strawberries before eating', duration: 1, stage: 'assemble' }
    ]
  },
  {
    id: 'breakfast_bacon_eggs',
    name: 'Classic Bacon & Scrambled Eggs',
    mealType: 'breakfast',
    prepTime: 12,
    costPerServing: 3.80,
    description: 'Crispy applewood smoked bacon paired with velvety, farm-fresh soft scrambled eggs.',
    tags: ['Keto', 'Gluten-Free', 'Dairy-Free'],
    ingredients: [
      { id: 'bacon', name: 'Bacon', amount: '3 strips', cost: 1.80, category: 'Meat/Seafood', substitutionId: 'bacon' },
      { id: 'egg', name: 'Egg', amount: '3', cost: 0.90, category: 'Dairy/Eggs', substitutionId: 'egg' },
      { id: 'olive_oil', name: 'Olive Oil', amount: '1 tsp', cost: 0.20, category: 'Pantry' },
      { id: 'chives', name: 'Fresh Chives', amount: '5g', cost: 0.90, category: 'Produce' }
    ],
    steps: [
      { action: 'Slice chives thinly; whisk eggs with a pinch of salt and pepper until pale yellow', duration: 3, stage: 'prep' },
      { action: 'Fry bacon in a pan until crispy and blistered. Transfer to a paper towel to drain', duration: 5, stage: 'cook' },
      { action: 'Pour off excess bacon fat. Cook eggs over low heat, stirring continuously for soft curds', duration: 3, stage: 'cook' },
      { action: 'Plate the eggs, sprinkle with chives, and serve alongside the crispy bacon strips', duration: 1, stage: 'assemble' }
    ]
  },
  {
    id: 'breakfast_banana_smoothie',
    name: 'Banana Oat Energy Smoothie',
    mealType: 'breakfast',
    prepTime: 5,
    costPerServing: 2.10,
    description: 'A creamy, delicious blend of banana, rolled oats, and peanut butter to power your day.',
    tags: ['Vegan', 'Vegetarian', 'Dairy-Free'],
    ingredients: [
      { id: 'banana', name: 'Banana', amount: '1', cost: 0.40, category: 'Produce' },
      { id: 'rolled_oats', name: 'Rolled Oats', amount: '30g', cost: 0.30, category: 'Pantry' },
      { id: 'peanut_butter', name: 'Peanut Butter', amount: '2 tbsp', cost: 0.60, category: 'Pantry', substitutionId: 'peanut_butter' },
      { id: 'almond_milk', name: 'Almond Milk', amount: '200ml', cost: 0.60, category: 'Dairy/Eggs' },
      { id: 'cinnamon', name: 'Ground Cinnamon', amount: '1 pinch', cost: 0.20, category: 'Pantry' }
    ],
    steps: [
      { action: 'Peel the banana and roughly chop it; measure out the oats, peanut butter, and milk', duration: 2, stage: 'prep' },
      { action: 'Add all ingredients into a high-speed blender container', duration: 1, stage: 'prep' },
      { action: 'Blend on high for 60-90 seconds until perfectly silky and smooth', duration: 1, stage: 'cook' },
      { action: 'Pour into a tall glass, dust with a pinch of cinnamon, and enjoy immediately', duration: 1, stage: 'assemble' }
    ]
  },

  // --- LUNCHES ---
  {
    id: 'lunch_quinoa_salad',
    name: 'Mediterranean Quinoa Salad',
    mealType: 'lunch',
    prepTime: 15,
    costPerServing: 3.90,
    description: 'Refreshing quinoa tossed with cucumbers, kalamata olives, cherry tomatoes, and crumbly feta cheese.',
    tags: ['Vegetarian', 'Gluten-Free'],
    ingredients: [
      { id: 'quinoa', name: 'Quinoa', amount: '70g', cost: 0.80, category: 'Pantry' },
      { id: 'cucumber', name: 'English Cucumber', amount: '0.5', cost: 0.60, category: 'Produce' },
      { id: 'cherry_tomatoes', name: 'Cherry Tomatoes', amount: '80g', cost: 1.00, category: 'Produce' },
      { id: 'olives', name: 'Kalamata Olives', amount: '30g', cost: 0.70, category: 'Pantry' },
      { id: 'feta_cheese', name: 'Feta Cheese', amount: '40g', cost: 0.80, category: 'Dairy/Eggs', substitutionId: 'feta' }
    ],
    steps: [
      { action: 'Rinse quinoa and cook in water/broth (1:2 ratio) for 12 minutes, then let cool', duration: 5, stage: 'cook' },
      { action: 'Dice cucumber, halve tomatoes, and chop olives', duration: 5, stage: 'prep' },
      { action: 'Whisk lemon juice and olive oil in a large serving bowl to create a quick dressing', duration: 2, stage: 'prep' },
      { action: 'Combine quinoa, veggies, crumbled feta, and dressing; toss well to combine', duration: 3, stage: 'assemble' }
    ]
  },
  {
    id: 'lunch_peanut_noodles',
    name: 'Spicy Peanut Rice Noodles',
    mealType: 'lunch',
    prepTime: 12,
    costPerServing: 3.50,
    description: 'Chewy rice noodles coated in a rich, spicy peanut-ginger sauce, topped with crunchy green onions.',
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free'],
    ingredients: [
      { id: 'rice_noodles', name: 'Rice Noodles', amount: '80g', cost: 0.70, category: 'Pantry' },
      { id: 'peanut_butter', name: 'Peanut Butter', amount: '2 tbsp', cost: 0.60, category: 'Pantry', substitutionId: 'peanut_butter' },
      { id: 'soy_sauce', name: 'Gluten-Free Tamari / Soy Sauce', amount: '1.5 tbsp', cost: 0.40, category: 'Pantry' },
      { id: 'sriracha', name: 'Sriracha Chili Sauce', amount: '1 tbsp', cost: 0.30, category: 'Pantry' },
      { id: 'ginger_garlic', name: 'Fresh Ginger & Garlic', amount: '1 tsp', cost: 0.50, category: 'Produce' },
      { id: 'green_onion', name: 'Green Onion & Crushed Peanuts', amount: '10g', cost: 1.00, category: 'Produce' }
    ],
    steps: [
      { action: 'Soak rice noodles in boiling water for 8 minutes until tender; drain and rinse with cold water', duration: 3, stage: 'cook' },
      { action: 'Mince garlic and grate ginger; chop green onions and crush peanuts for garnish', duration: 4, stage: 'prep' },
      { action: 'Whisk peanut butter, tamari, sriracha, garlic, ginger, and 2 tbsp warm water into a smooth sauce', duration: 3, stage: 'prep' },
      { action: 'Toss noodles in the peanut sauce until fully coated, garnish with green onions and crushed peanuts', duration: 2, stage: 'assemble' }
    ]
  },
  {
    id: 'lunch_keto_caesar',
    name: 'Keto Chicken Caesar Salad',
    mealType: 'lunch',
    prepTime: 15,
    costPerServing: 5.50,
    description: 'Crisp romaine lettuce topped with juicy grilled chicken breast, parmesan shavings, and creamy Caesar dressing.',
    tags: ['Keto', 'Gluten-Free'],
    ingredients: [
      { id: 'chicken_breast', name: 'Chicken Breast', amount: '150g', cost: 2.20, category: 'Meat/Seafood', substitutionId: 'chicken' },
      { id: 'romaine_lettuce', name: 'Romaine Lettuce', amount: '1 head', cost: 1.20, category: 'Produce' },
      { id: 'parmesan', name: 'Parmesan Cheese', amount: '20g', cost: 0.60, category: 'Dairy/Eggs' },
      { id: 'caesar_dressing', name: 'Creamy Caesar Dressing', amount: '2 tbsp', cost: 1.00, category: 'Pantry' },
      { id: 'olive_oil', name: 'Olive Oil', amount: '1 tbsp', cost: 0.50, category: 'Pantry' }
    ],
    steps: [
      { action: 'Season chicken breast with salt, pepper, and garlic powder; wash and chop romaine lettuce', duration: 5, stage: 'prep' },
      { action: 'Heat olive oil in a skillet and cook chicken breast for 6 minutes per side until done', duration: 12, stage: 'cook' },
      { action: 'Let chicken rest for 3 minutes, then slice into thin bite-sized strips', duration: 3, stage: 'prep' },
      { action: 'Toss romaine with Caesar dressing and parmesan; top with the warm sliced chicken breast', duration: 2, stage: 'assemble' }
    ]
  },
  {
    id: 'lunch_tomato_soup',
    name: 'Loaded Tomato Lentil Soup',
    mealType: 'lunch',
    prepTime: 20,
    costPerServing: 2.60,
    description: 'A comforting, thick soup filled with red lentils, crushed tomatoes, and Italian herbs.',
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free'],
    ingredients: [
      { id: 'canned_tomatoes', name: 'Crushed Tomatoes', amount: '0.5 can', cost: 0.70, category: 'Pantry' },
      { id: 'red_lentils', name: 'Red Lentils', amount: '60g', cost: 0.40, category: 'Pantry' },
      { id: 'onion_garlic', name: 'Yellow Onion & Garlic', amount: '1 unit', cost: 0.50, category: 'Produce' },
      { id: 'vegetable_broth', name: 'Vegetable Broth', amount: '250ml', cost: 0.50, category: 'Pantry' },
      { id: 'spinach', name: 'Baby Spinach', amount: '30g', cost: 0.50, category: 'Produce' }
    ],
    steps: [
      { action: 'Dice the onion and mince garlic; measure out red lentils', duration: 4, stage: 'prep' },
      { action: 'Sauté onion and garlic in a soup pot with olive oil until soft and translucent (3 mins)', duration: 3, stage: 'cook' },
      { action: 'Add lentils, crushed tomatoes, and vegetable broth. Bring to a boil, then simmer for 15 minutes', duration: 15, stage: 'cook' },
      { action: 'Stir in spinach until wilted, season with salt, pepper, and dry basil, then ladle into bowls', duration: 2, stage: 'assemble' }
    ]
  },

  // --- DINNERS ---
  {
    id: 'dinner_garlic_salmon',
    name: 'Creamy Garlic Butter Salmon',
    mealType: 'dinner',
    prepTime: 20,
    costPerServing: 8.50,
    description: 'Tender pan-seared salmon fillet in a rich, buttery garlic sauce with fresh spinach and cherry tomatoes.',
    tags: ['Keto', 'Gluten-Free'],
    ingredients: [
      { id: 'salmon_fillet', name: 'Salmon Fillet', amount: '180g', cost: 5.50, category: 'Meat/Seafood', substitutionId: 'salmon' },
      { id: 'heavy_cream', name: 'Heavy Cream', amount: '60ml', cost: 0.80, category: 'Dairy/Eggs', substitutionId: 'cream' },
      { id: 'butter', name: 'Butter', amount: '20g', cost: 0.60, category: 'Dairy/Eggs', substitutionId: 'butter' },
      { id: 'garlic', name: 'Garlic Cloves', amount: '3', cost: 0.30, category: 'Produce' },
      { id: 'spinach', name: 'Baby Spinach', amount: '50g', cost: 0.80, category: 'Produce' },
      { id: 'cherry_tomatoes', name: 'Cherry Tomatoes', amount: '50g', cost: 0.50, category: 'Produce' }
    ],
    steps: [
      { action: 'Pat salmon dry and season with salt and pepper; mince garlic and halve tomatoes', duration: 5, stage: 'prep' },
      { action: 'Melt butter in a pan over medium-high heat and sear salmon for 4-5 minutes per side. Set aside', duration: 10, stage: 'cook' },
      { action: 'In same pan, sauté garlic, then add tomatoes and spinach. Pour in heavy cream and simmer for 3 mins', duration: 4, stage: 'cook' },
      { action: 'Return salmon to pan, spoon creamy sauce over it, and cook for another 2 minutes until hot', duration: 2, stage: 'assemble' }
    ]
  },
  {
    id: 'dinner_sweet_potato_curry',
    name: 'Chickpea Sweet Potato Curry',
    mealType: 'dinner',
    prepTime: 25,
    costPerServing: 3.40,
    description: 'A fragrant, warming yellow curry loaded with tender sweet potato chunks and protein-rich chickpeas.',
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free'],
    ingredients: [
      { id: 'sweet_potato', name: 'Sweet Potato', amount: '150g', cost: 0.80, category: 'Produce' },
      { id: 'chickpeas', name: 'Canned Chickpeas', amount: '0.5 can', cost: 0.60, category: 'Pantry' },
      { id: 'coconut_milk', name: 'Coconut Milk', amount: '200ml', cost: 1.20, category: 'Pantry' },
      { id: 'curry_paste', name: 'Yellow Curry Paste', amount: '1 tbsp', cost: 0.50, category: 'Pantry' },
      { id: 'spinach', name: 'Baby Spinach', amount: '30g', cost: 0.30, category: 'Produce' }
    ],
    steps: [
      { action: 'Peel and cube sweet potato; drain and rinse chickpeas', duration: 6, stage: 'prep' },
      { action: 'Fry curry paste in 1 tbsp coconut oil in a deep pot for 1 minute until aromatic', duration: 2, stage: 'cook' },
      { action: 'Add cubed sweet potato, chickpeas, coconut milk, and 100ml water. Simmer on medium-low for 18 minutes', duration: 18, stage: 'cook' },
      { action: 'Fold in spinach until wilted, squeeze fresh lime juice, and ladle curry into bowls', duration: 2, stage: 'assemble' }
    ]
  },
  {
    id: 'dinner_shrimp_pasta',
    name: 'Spicy Garlic Chili Shrimp Pasta',
    mealType: 'dinner',
    prepTime: 18,
    costPerServing: 6.80,
    description: 'Juicy tail-on shrimp sautéed with garlic, red pepper flakes, and white wine, tossed with spaghetti.',
    tags: ['Dairy-Free'],
    ingredients: [
      { id: 'shrimp', name: 'Shrimp (peeled & deveined)', amount: '120g', cost: 3.80, category: 'Meat/Seafood', substitutionId: 'shrimp' },
      { id: 'spaghetti', name: 'Spaghetti Pasta', amount: '80g', cost: 0.50, category: 'Pantry', substitutionId: 'spaghetti' },
      { id: 'garlic', name: 'Garlic Cloves', amount: '4', cost: 0.40, category: 'Produce' },
      { id: 'olive_oil', name: 'Extra Virgin Olive Oil', amount: '2 tbsp', cost: 0.80, category: 'Pantry' },
      { id: 'chili_flakes', name: 'Red Chili Flakes & Parsley', amount: '1 tsp', cost: 0.50, category: 'Pantry' },
      { id: 'lemon', name: 'Lemon Juice', amount: '1 tbsp', cost: 0.80, category: 'Produce' }
    ],
    steps: [
      { action: 'Boil spaghetti in salted water for 9-10 minutes until al dente', duration: 2, stage: 'cook' },
      { action: 'Mince garlic and chop parsley; pat shrimp dry and season with salt', duration: 4, stage: 'prep' },
      { action: 'Sauté garlic and chili flakes in olive oil until sizzling, add shrimp and cook for 3 mins until pink', duration: 4, stage: 'cook' },
      { action: 'Drain pasta and toss into skillet with shrimp, squeeze lemon juice, and garnish with chopped parsley', duration: 2, stage: 'assemble' }
    ]
  },
  {
    id: 'dinner_lemon_chicken',
    name: 'Lemon Herb Grilled Chicken & Broccoli',
    mealType: 'dinner',
    prepTime: 15,
    costPerServing: 4.50,
    description: 'Pan-roasted herb-marinated chicken breast served with crispy charred broccoli florets.',
    tags: ['Keto', 'Gluten-Free', 'Dairy-Free'],
    ingredients: [
      { id: 'chicken_breast', name: 'Chicken Breast', amount: '180g', cost: 2.50, category: 'Meat/Seafood', substitutionId: 'chicken' },
      { id: 'broccoli', name: 'Broccoli Crown', amount: '150g', cost: 1.00, category: 'Produce' },
      { id: 'olive_oil', name: 'Olive Oil', amount: '1.5 tbsp', cost: 0.60, category: 'Pantry' },
      { id: 'lemon_herb_mix', name: 'Lemon, Garlic, Oregano, Thyme', amount: '1 unit', cost: 0.40, category: 'Pantry' }
    ],
    steps: [
      { action: 'Cut chicken breast horizontally to butterfly; chop broccoli into small, even-sized florets', duration: 5, stage: 'prep' },
      { action: 'Marinate chicken in lemon juice, olive oil, minced garlic, oregano, thyme, salt, and pepper', duration: 5, stage: 'prep' },
      { action: 'Sear chicken in a hot grill pan for 5-6 mins per side; roast broccoli in another pan with olive oil', duration: 12, stage: 'cook' },
      { action: 'Plate the juicy grilled chicken alongside the roasted, lightly-charred broccoli florets', duration: 1, stage: 'assemble' }
    ]
  },
  {
    id: 'dinner_mushroom_steak',
    name: 'Garlic Portobello Mushroom Steaks',
    mealType: 'dinner',
    prepTime: 15,
    costPerServing: 4.20,
    description: 'Meaty Portobello mushroom caps pan-fried with garlic, rosemary, and soy sauce, served with sautéed greens.',
    tags: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free'],
    ingredients: [
      { id: 'portobello', name: 'Portobello Mushroom Caps', amount: '2 caps', cost: 2.20, category: 'Produce' },
      { id: 'garlic', name: 'Garlic Cloves', amount: '3', cost: 0.30, category: 'Produce' },
      { id: 'rosemary', name: 'Fresh Rosemary', amount: '1 sprig', cost: 0.50, category: 'Produce' },
      { id: 'tamari', name: 'Gluten-Free Tamari / Soy Sauce', amount: '1 tbsp', cost: 0.40, category: 'Pantry' },
      { id: 'kale', name: 'Curly Kale', amount: '80g', cost: 0.80, category: 'Produce' }
    ],
    steps: [
      { action: 'Wipe mushrooms clean, remove stems; mince garlic and strip rosemary leaves', duration: 4, stage: 'prep' },
      { action: 'Sauté garlic and rosemary in olive oil, then add portobello caps. Cook for 5 mins per side, splashing tamari', duration: 10, stage: 'cook' },
      { action: 'Remove mushrooms. Toss kale into the same pan and sauté for 3 minutes until wilted and tender', duration: 3, stage: 'cook' },
      { action: 'Slice mushroom caps into thick strips and serve over the warm, garlic-infused kale bed', duration: 1, stage: 'assemble' }
    ]
  }
];

// Available substitutions with cost differentials and dietary modifications
export const substitutions = {
  bread: [
    {
      id: 'sub_bread_gf',
      name: 'Gluten-Free Bread',
      costDiff: 0.80,
      tagsAdded: ['Gluten-Free'],
      tagsRemoved: []
    },
    {
      id: 'sub_bread_lettuce',
      name: 'Lettuce Wraps',
      costDiff: -0.20,
      tagsAdded: ['Gluten-Free', 'Keto', 'Vegan', 'Dairy-Free'],
      tagsRemoved: []
    }
  ],
  egg: [
    {
      id: 'sub_egg_tofu',
      name: 'Scrambled Tofu',
      costDiff: 0.30,
      tagsAdded: ['Vegan', 'Dairy-Free'],
      tagsRemoved: ['Vegetarian']
    }
  ],
  bacon: [
    {
      id: 'sub_bacon_tempeh',
      name: 'Tempeh Bacon',
      costDiff: 0.60,
      tagsAdded: ['Vegan', 'Vegetarian', 'Dairy-Free'],
      tagsRemoved: ['Keto']
    }
  ],
  peanut_butter: [
    {
      id: 'sub_pb_almond',
      name: 'Almond Butter',
      costDiff: 0.90,
      tagsAdded: ['Nut-Free'],
      tagsRemoved: []
    },
    {
      id: 'sub_pb_sunflower',
      name: 'Sunflower Seed Butter',
      costDiff: 0.70,
      tagsAdded: ['Nut-Free'],
      tagsRemoved: []
    }
  ],
  feta: [
    {
      id: 'sub_feta_vegan',
      name: 'Vegan Violife Feta',
      costDiff: 1.10,
      tagsAdded: ['Vegan', 'Dairy-Free'],
      tagsRemoved: []
    }
  ],
  chicken: [
    {
      id: 'sub_chicken_tofu',
      name: 'Extra Firm Tofu',
      costDiff: -0.50,
      tagsAdded: ['Vegan', 'Vegetarian'],
      tagsRemoved: []
    },
    {
      id: 'sub_chicken_tempeh',
      name: 'Tempeh Strips',
      costDiff: 0.20,
      tagsAdded: ['Vegan', 'Vegetarian'],
      tagsRemoved: []
    }
  ],
  salmon: [
    {
      id: 'sub_salmon_tofu',
      name: 'Teriyaki Tofu Block',
      costDiff: -3.00,
      tagsAdded: ['Vegan', 'Vegetarian'],
      tagsRemoved: []
    }
  ],
  cream: [
    {
      id: 'sub_cream_coconut',
      name: 'Coconut Cream',
      costDiff: 0.20,
      tagsAdded: ['Vegan', 'Dairy-Free'],
      tagsRemoved: []
    }
  ],
  butter: [
    {
      id: 'sub_butter_coconut',
      name: 'Coconut Oil',
      costDiff: 0.00,
      tagsAdded: ['Vegan', 'Dairy-Free'],
      tagsRemoved: []
    },
    {
      id: 'sub_butter_vegan',
      name: 'Vegan Butter Spread',
      costDiff: 0.40,
      tagsAdded: ['Vegan', 'Dairy-Free'],
      tagsRemoved: []
    }
  ],
  shrimp: [
    {
      id: 'sub_shrimp_tofu',
      name: 'Cubed Tofu',
      costDiff: -1.80,
      tagsAdded: ['Vegan', 'Vegetarian'],
      tagsRemoved: []
    }
  ],
  spaghetti: [
    {
      id: 'sub_pasta_gf',
      name: 'Brown Rice Pasta (Gluten-Free)',
      costDiff: 0.60,
      tagsAdded: ['Gluten-Free'],
      tagsRemoved: []
    },
    {
      id: 'sub_pasta_zoodles',
      name: 'Zucchini Noodles (Zoodles)',
      costDiff: 0.40,
      tagsAdded: ['Gluten-Free', 'Keto', 'Vegan', 'Dairy-Free', 'Vegetarian'],
      tagsRemoved: []
    }
  ]
};
