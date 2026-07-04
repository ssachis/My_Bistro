import { recipes, substitutions } from './database.js';

// Currency & Conversion Config (US Dollars to Indian Rupees)
const USD_TO_INR = 85;

// Application State
const state = {
  currentStep: 1,
  cravings: '',
  selectedDiets: new Set(),
  budgetLimit: 500, // Default 500 Rupees
  schedule: 'standard', // standard, busy, leisurely
  portions: 1,
  apiKey: '', // Loaded securely from .env
  selectedMeals: {
    breakfast: null,
    lunch: null,
    dinner: null
  },
  activeSubstitutions: {}, // recipeId_ingredientId -> substitution object
  checkedIngredients: new Set(), // checkId -> boolean
  completedTasks: new Set(), // taskId -> boolean
  recipePools: {
    breakfast: [],
    lunch: [],
    dinner: []
  },
  poolIndices: {
    breakfast: 0,
    lunch: 0,
    dinner: 0
  }
};

// DOM Elements
const elements = {
  currentDate: document.getElementById('current-date'),
  cravingsInput: document.getElementById('cravings-input'),
  suggestChips: document.querySelectorAll('.suggest-chip'),
  restrictionBtns: document.querySelectorAll('.restriction-card-btn'),

  budgetSlider: document.getElementById('budget-slider'),
  budgetDisplayVal: document.getElementById('budget-display-val'),
  schedulePills: document.querySelectorAll('.schedule-pill'),
  portionsCount: document.getElementById('val-portions'),
  btnDecPort: document.getElementById('btn-dec-port'),
  btnIncPort: document.getElementById('btn-inc-port'),

  btnGeneratePlan: document.getElementById('btn-generate-plan'),
  btnBackToWizard: document.getElementById('btn-back-to-wizard'),
  btnCookMode: document.getElementById('btn-cook-mode'),

  wizardProgressFill: document.getElementById('wizard-progress-fill'),
  wizardSteps: document.querySelectorAll('.wizard-step'),

  // Results view elements
  resultsTotalCost: document.getElementById('results-total-cost'),
  resultsBudgetBadge: document.getElementById('results-budget-badge'),
  resultsCostCard: document.getElementById('results-cost-summary-card'),

  tabButtons: document.querySelectorAll('.tab-btn'),
  tabPanes: document.querySelectorAll('.tab-pane'),

  groceriesListTarget: document.getElementById('groceries-list-target'),

  timelinePacingVal: document.getElementById('timeline-pacing-val'),
  timelinePrepVal: document.getElementById('timeline-prep-val'),
  timelineDiffVal: document.getElementById('timeline-diff-val'),
  lblProgressCount: document.getElementById('lbl-progress-count'),
  timelineProgressFill: document.getElementById('timeline-progress-fill'),
  timelineTasksTarget: document.getElementById('timeline-tasks-target'),

  // Modals & toast
  detailsModal: document.getElementById('details-modal'),
  closeModal: document.getElementById('close-modal'),
  modalBodyContent: document.getElementById('modal-body-content'),
  toast: document.getElementById('toast'),
  toastIcon: document.getElementById('toast-icon'),
  toastMessage: document.getElementById('toast-message'),
  
  // Settings elements
  btnSettingsToggle: document.getElementById('btn-settings-toggle'),
  settingsModal: document.getElementById('settings-modal'),
  closeSettingsModal: document.getElementById('close-settings-modal'),
  settingsApiKey: document.getElementById('settings-api-key'),
  settingsApiStatus: document.getElementById('settings-api-status'),
  btnSaveSettings: document.getElementById('btn-save-settings')
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  initDate();
  await loadEnv(); // Retrieve api key securely from .env
  setupEventListeners();
  updateWizardProgress();
  lucide.createIcons(); // Initialize all icons on startup
});

function initDate() {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  elements.currentDate.textContent = new Date().toLocaleDateString('en-US', options);
}

// Toast
function showToast(message, isError = false) {
  elements.toastMessage.textContent = message;
  if (isError) {
    elements.toast.classList.add('error-toast');
    elements.toastIcon.setAttribute('data-lucide', 'alert-circle');
  } else {
    elements.toast.classList.remove('error-toast');
    elements.toastIcon.setAttribute('data-lucide', 'check-circle');
  }
  lucide.createIcons();
  elements.toast.classList.add('active');
  setTimeout(() => {
    elements.toast.classList.remove('active');
  }, 3000);
}

// Read API Key from local served .env or browser sandbox local storage
async function loadEnv() {
  // 1. Try local storage first (pasted from deployment settings modal)
  state.apiKey = localStorage.getItem('spoonacular_api_key') || '';
  if (state.apiKey) {
    console.log("Spoonacular API Key loaded from local storage.");
    return;
  }

  // 2. Try fetching local .env file (standard for local dev)
  try {
    const response = await fetch('.env');
    if (response.ok) {
      const text = await response.text();
      const lines = text.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || trimmed === '') continue;
        const parts = trimmed.split('=');
        if (parts[0].trim() === 'SPOONACULAR_API_KEY') {
          state.apiKey = parts.slice(1).join('=').trim().replace(/['"]/g, '');
          if (state.apiKey) {
            console.log("Spoonacular API Key successfully loaded from secure local .env file.");
          }
        }
      }
    }
  } catch (err) {
    console.warn("Could not read local .env file. Running in local fallback mode.", err);
  }
}

function updateSettingsUI() {
  if (!elements.settingsApiKey) return;
  elements.settingsApiKey.value = state.apiKey;
  
  if (state.apiKey && state.apiKey.trim() !== '') {
    elements.settingsApiStatus.className = 'api-status-tag online';
    elements.settingsApiStatus.textContent = 'Connected (Live API)';
  } else {
    elements.settingsApiStatus.className = 'api-status-tag offline';
    elements.settingsApiStatus.textContent = 'Offline Fallback';
  }
}

// Progress Bar Manager
function updateWizardProgress() {
  const pct = (state.currentStep / 4) * 100;
  elements.wizardProgressFill.style.width = `${pct}%`;
}

// Wizard Navigation
function goToStep(step) {
  elements.wizardSteps.forEach(s => s.classList.remove('active'));
  state.currentStep = step;
  document.getElementById(`step-${step}`).classList.add('active');
  updateWizardProgress();

  if (step === 4) {
    renderMealPlanCards();
    renderGroceryList();
    generateTimeline();
    calculateCostsAndFeasibility();
  }
}

// Event Listeners
function setupEventListeners() {
  // Settings modal triggers
  if (elements.btnSettingsToggle) {
    elements.btnSettingsToggle.addEventListener('click', () => {
      updateSettingsUI();
      elements.settingsModal.classList.add('active');
    });
  }

  if (elements.closeSettingsModal) {
    elements.closeSettingsModal.addEventListener('click', () => {
      elements.settingsModal.classList.remove('active');
    });
  }

  if (elements.settingsModal) {
    elements.settingsModal.querySelector('.modal-backdrop').addEventListener('click', () => {
      elements.settingsModal.classList.remove('active');
    });
  }

  if (elements.btnSaveSettings) {
    elements.btnSaveSettings.addEventListener('click', () => {
      const val = elements.settingsApiKey.value.trim();
      state.apiKey = val;
      if (val) {
        localStorage.setItem('spoonacular_api_key', val);
        showToast("Settings saved! Connected to Spoonacular API.");
      } else {
        localStorage.removeItem('spoonacular_api_key');
        showToast("Settings saved! Switched to offline fallback mode.");
      }
      updateSettingsUI();
      elements.settingsModal.classList.remove('active');
    });
  }

  // Wizard Next/Back buttons
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = parseInt(btn.getAttribute('data-next-step'));
      goToStep(next);
    });
  });

  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      const prev = parseInt(btn.getAttribute('data-prev-step'));
      goToStep(prev);
    });
  });

  elements.btnBackToWizard.addEventListener('click', () => {
    goToStep(3);
  });

  elements.btnCookMode.addEventListener('click', () => {
    showToast("🎉 Timeline locked! Bistro Cooking Mode Activated.");
  });

  // Step 1: Cravings input & chips
  elements.cravingsInput.addEventListener('input', (e) => {
    state.cravings = e.target.value;
  });

  elements.suggestChips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.cravingsInput.value = chip.textContent;
      state.cravings = chip.textContent;
      showToast(`Selected craving: "${chip.textContent}"`);
      setTimeout(() => goToStep(2), 300);
    });
  });

  // Step 2: Restrictions grids
  elements.restrictionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const diet = btn.getAttribute('data-diet');
      if (state.selectedDiets.has(diet)) {
        state.selectedDiets.delete(diet);
        btn.classList.remove('active');
      } else {
        state.selectedDiets.add(diet);
        btn.classList.add('active');
      }
    });
  });

  // Step 3: Budget slider, schedule pills, portions
  elements.budgetSlider.addEventListener('input', (e) => {
    state.budgetLimit = parseFloat(e.target.value);
    elements.budgetDisplayVal.textContent = `₹${state.budgetLimit.toFixed(0)}`;
  });

  elements.schedulePills.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.schedulePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.schedule = pill.getAttribute('data-schedule');
    });
  });

  // Portions inc/dec
  elements.btnDecPort.addEventListener('click', () => {
    if (state.portions > 1) {
      state.portions--;
      elements.portionsCount.textContent = state.portions;
    }
  });

  elements.btnIncPort.addEventListener('click', () => {
    if (state.portions < 12) {
      state.portions++;
      elements.portionsCount.textContent = state.portions;
    }
  });

  // Step 3 Generate Plan Button
  elements.btnGeneratePlan.addEventListener('click', async () => {
    elements.btnGeneratePlan.disabled = true;
    elements.btnGeneratePlan.innerHTML = `Curating plan... <i style="display:inline-block;width:12px;height:12px;border:2px solid white;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;vertical-align:middle;margin-left:4px;"></i>`;

    if (!document.getElementById('spin-style')) {
      const style = document.createElement('style');
      style.id = 'spin-style';
      style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
      document.head.appendChild(style);
    }

    try {
      await curateMealPlans();
      if (state.selectedMeals.breakfast && state.selectedMeals.lunch && state.selectedMeals.dinner) {
        goToStep(4);
      } else {
        showToast("Could not curate a full meal plan. Try adjusting dietary filters or cravings!", true);
      }
    } catch (err) {
      console.error(err);
      showToast("Error curating meals. Fallback database loaded.", true);
      curateLocalFallback();
      goToStep(4);
    } finally {
      elements.btnGeneratePlan.disabled = false;
      elements.btnGeneratePlan.innerHTML = `Curate My Cooking Plan <i data-lucide="sparkles"></i>`;
      lucide.createIcons();
    }
  });

  // Step 4: Results Tab Toggles
  elements.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.tabButtons.forEach(b => b.classList.remove('active'));
      elements.tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const tabTarget = btn.getAttribute('data-tab');
      document.getElementById(`pane-${tabTarget}`).classList.add('active');
    });
  });

  // Shuffle buttons inside Step 4 Curated Meals
  document.querySelectorAll('.btn-shuffle-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const mealType = btn.getAttribute('data-meal-type');
      shuffleMealSlot(mealType);
    });
  });

  // Modal Details closing
  elements.closeModal.addEventListener('click', () => {
    elements.detailsModal.classList.remove('active');
  });

  elements.detailsModal.querySelector('.modal-backdrop').addEventListener('click', () => {
    elements.detailsModal.classList.remove('active');
  });
}

/* -------------------------------------------------------------
   Scoring & Curation Engine
------------------------------------------------------------- */
async function curateMealPlans() {
  if (state.apiKey && state.apiKey.trim() !== '') {
    await curateFromSpoonacular();
  } else {
    curateLocalFallback();
  }
}

// 1. Curate from Spoonacular API
async function curateFromSpoonacular() {
  const slots = ['breakfast', 'lunch', 'dinner'];

  const dietMap = {
    'Keto': 'ketogenic',
    'Gluten-Free': 'gluten free',
    'Vegan': 'vegan',
    'Vegetarian': 'vegetarian'
  };

  const intoleranceMap = {
    'Dairy-Free': 'dairy',
    'Nut-Free': 'peanut,tree nut'
  };

  const activeDiets = [];
  const activeIntolerances = [];

  state.selectedDiets.forEach(diet => {
    if (dietMap[diet]) activeDiets.push(dietMap[diet]);
    if (intoleranceMap[diet]) activeIntolerances.push(intoleranceMap[diet]);
  });

  const dietQuery = activeDiets.join(',');
  const intoleranceQuery = activeIntolerances.join(',');

  const fetchPromises = slots.map(async (slot) => {
    let typeQuery = 'main course';
    if (slot === 'breakfast') typeQuery = 'breakfast';
    if (slot === 'lunch') typeQuery = 'salad,soup,appetizer,bread';

    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${state.apiKey}&type=${typeQuery}&number=6&addRecipeInformation=true&fillIngredients=true`;

    if (state.cravings.trim() !== '') {
      url += `&query=${encodeURIComponent(state.cravings)}`;
    }
    if (dietQuery) {
      url += `&diet=${encodeURIComponent(dietQuery)}`;
    }
    if (intoleranceQuery) {
      url += `&intolerances=${encodeURIComponent(intoleranceQuery)}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Spoonacular status ${response.status}`);
      }
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const pool = data.results.map(recipe => parseSpoonacularRecipe(recipe, slot));
        state.recipePools[slot] = pool;
        state.poolIndices[slot] = 0;
        state.selectedMeals[slot] = pool[0];
      } else {
        console.warn(`No results for ${slot}. Fetching generic ${slot} matching diets...`);
        let fallbackUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${state.apiKey}&type=${typeQuery}&number=4&addRecipeInformation=true&fillIngredients=true`;
        if (dietQuery) fallbackUrl += `&diet=${encodeURIComponent(dietQuery)}`;
        if (intoleranceQuery) fallbackUrl += `&intolerances=${encodeURIComponent(intoleranceQuery)}`;

        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();

        if (fallbackData.results && fallbackData.results.length > 0) {
          const pool = fallbackData.results.map(recipe => parseSpoonacularRecipe(recipe, slot));
          state.recipePools[slot] = pool;
          state.poolIndices[slot] = 0;
          state.selectedMeals[slot] = pool[0];
        } else {
          useLocalFallbackForSlot(slot);
        }
      }
    } catch (err) {
      console.error(`Spoonacular fetch failed for ${slot}:`, err);
      useLocalFallbackForSlot(slot);
    }
  });

  await Promise.all(fetchPromises);
}

function parseSpoonacularRecipe(recipe, slot) {
  // Map substitutions
  const matchedIngredients = recipe.extendedIngredients.map((ing, idx) => {
    const subId = matchSubstitutionId(ing.name);
    // Cost estimation scaled to Rupees
    const itemCost = estimateIngredientCost(ing.name, ing.amount) * USD_TO_INR;

    return {
      id: ing.id ? `sp_ing_${ing.id}` : `sp_ing_${recipe.id}_${idx}`,
      name: ing.name,
      amount: `${ing.amount.toFixed(1)} ${ing.unit || 'unit'}`,
      cost: itemCost,
      category: ing.aisle || 'Pantry',
      substitutionId: subId
    };
  });

  // Steps
  let steps = [];
  if (recipe.analyzedInstructions && recipe.analyzedInstructions[0] && recipe.analyzedInstructions[0].steps.length > 0) {
    steps = recipe.analyzedInstructions[0].steps.map(s => {
      const text = s.step.toLowerCase();
      let stage = 'cook';
      if (text.includes('chop') || text.includes('slice') || text.includes('peel') || text.includes('dice') || text.includes('mix') || text.includes('stir')) {
        stage = 'prep';
      }
      return {
        action: s.step,
        duration: s.length ? s.length.number : 5,
        stage: stage
      };
    });
  } else {
    steps = [
      { action: `Gather ingredients: ${recipe.extendedIngredients.slice(0, 4).map(i => i.name).join(', ')}.`, duration: 4, stage: 'prep' },
      { action: `Prepare and wash ingredients.`, duration: 5, stage: 'prep' },
      { action: `Cook ingredients: follow standard instructions for ${recipe.title}.`, duration: 15, stage: 'cook' },
      { action: `Plate and serve!`, duration: 2, stage: 'assemble' }
    ];
  }

  const tags = [];
  if (recipe.vegan) tags.push('Vegan');
  if (recipe.vegetarian) tags.push('Vegetarian');
  if (recipe.glutenFree) tags.push('Gluten-Free');
  if (recipe.ketogenic || (recipe.diets && recipe.diets.includes('ketogenic'))) tags.push('Keto');
  if (recipe.dairyFree) tags.push('Dairy-Free');

  const nutFree = !recipe.extendedIngredients.some(i => {
    const n = i.name.toLowerCase();
    return n.includes('peanut') || n.includes('almond') || n.includes('walnut') || n.includes('cashew') || n.includes('pecan');
  });
  if (nutFree) tags.push('Nut-Free');

  // Convert serving cost from USD to Rupees
  const cost = (recipe.pricePerServing ? recipe.pricePerServing / 100 : 4.0) * USD_TO_INR;

  return {
    id: `spoon_${recipe.id}`,
    name: recipe.title,
    mealType: slot,
    prepTime: recipe.readyInMinutes || 20,
    costPerServing: cost,
    description: `A customized Spoonacular meal featuring ${recipe.extendedIngredients.slice(0, 3).map(i => i.name).join(', ')}.`,
    tags: tags,
    ingredients: matchedIngredients,
    steps: steps,
    image: recipe.image
  };
}

function matchSubstitutionId(name) {
  const n = name.toLowerCase();
  if (n.includes('bread') || n.includes('sourdough') || n.includes('baguette')) return 'bread';
  if (n.includes('egg')) return 'egg';
  if (n.includes('bacon') || n.includes('ham')) return 'bacon';
  if (n.includes('peanut butter')) return 'peanut_butter';
  if (n.includes('feta')) return 'feta';
  if (n.includes('chicken') || n.includes('poultry') || n.includes('turkey')) return 'chicken';
  if (n.includes('salmon')) return 'salmon';
  if (n.includes('cream') || n.includes('milk')) return 'cream';
  if (n.includes('butter')) return 'butter';
  if (n.includes('shrimp') || n.includes('prawn')) return 'shrimp';
  if (n.includes('spaghetti') || n.includes('pasta') || n.includes('noodle')) return 'spaghetti';
  return null;
}

function estimateIngredientCost(name, amount) {
  const n = name.toLowerCase();
  let baseCost = 0.80;

  if (n.includes('chicken') || n.includes('beef') || n.includes('pork') || n.includes('meat')) baseCost = 2.50;
  else if (n.includes('salmon') || n.includes('shrimp') || n.includes('fish') || n.includes('seafood')) baseCost = 4.50;
  else if (n.includes('avocado') || n.includes('feta') || n.includes('parmesan') || n.includes('cheese')) baseCost = 1.20;
  else if (n.includes('olive oil') || n.includes('butter') || n.includes('syrup')) baseCost = 0.60;
  else if (n.includes('egg')) baseCost = 0.30;
  else if (n.includes('garlic') || n.includes('onion') || n.includes('lemon')) baseCost = 0.20;
  else if (n.includes('spinach') || n.includes('broccoli') || n.includes('tomato')) baseCost = 0.40;

  const scale = amount && !isNaN(amount) ? Math.min(Math.max(amount / 2, 0.5), 2.5) : 1;
  return baseCost * scale;
}

// 2. Local Fallback scoring (converted to Rupees)
function curateLocalFallback() {
  const slots = ['breakfast', 'lunch', 'dinner'];

  slots.forEach(slot => {
    let filtered = recipes.filter(r => r.mealType === slot);

    // Apply dietary restrictions hard filter
    if (state.selectedDiets.size > 0) {
      filtered = filtered.filter(recipe => {
        return Array.from(state.selectedDiets).every(diet => {
          if (recipe.tags.includes(diet)) return true;
          const hasSatisfyingSub = recipe.ingredients.some(ing => {
            if (!ing.substitutionId) return false;
            const subs = substitutions[ing.substitutionId] || [];
            return subs.some(sub => sub.tagsAdded.includes(diet));
          });
          return hasSatisfyingSub;
        });
      });
    }

    // Score
    const scoredPool = filtered.map(recipe => {
      let score = 100;
      if (state.cravings.trim() !== '') {
        const tokens = state.cravings.toLowerCase().split(/\s+/).filter(t => t.length > 1);
        let matchCount = 0;
        tokens.forEach(token => {
          if (recipe.name.toLowerCase().includes(token)) matchCount += 4;
          if (recipe.description.toLowerCase().includes(token)) matchCount += 2;
          if (recipe.ingredients.some(i => i.name.toLowerCase().includes(token))) matchCount += 2;
        });
        score += matchCount * 15;
      }
      if (state.schedule === 'busy') {
        if (recipe.prepTime > 15) score -= (recipe.prepTime - 15) * 5;
        else score += 15;
      } else if (state.schedule === 'leisurely') {
        if (recipe.prepTime > 15) score += 10;
      }

      // Convert standard fallback recipe to Rupees on the fly
      const convertedRecipe = {
        ...recipe,
        costPerServing: recipe.costPerServing * USD_TO_INR,
        ingredients: recipe.ingredients.map(ing => ({
          ...ing,
          cost: ing.cost * USD_TO_INR
        }))
      };

      return { recipe: convertedRecipe, score };
    });

    scoredPool.sort((a, b) => b.score - a.score);

    state.recipePools[slot] = scoredPool.map(item => item.recipe);
    state.poolIndices[slot] = 0;

    if (state.recipePools[slot].length > 0) {
      state.selectedMeals[slot] = state.recipePools[slot][0];
    } else {
      state.selectedMeals[slot] = null;
    }
  });
}

function useLocalFallbackForSlot(slot) {
  let filtered = recipes.filter(r => r.mealType === slot);

  if (state.selectedDiets.size > 0) {
    filtered = filtered.filter(recipe => {
      return Array.from(state.selectedDiets).every(diet => {
        if (recipe.tags.includes(diet)) return true;
        const hasSatisfyingSub = recipe.ingredients.some(ing => {
          if (!ing.substitutionId) return false;
          const subs = substitutions[ing.substitutionId] || [];
          return subs.some(sub => sub.tagsAdded.includes(diet));
        });
        return hasSatisfyingSub;
      });
    });
  }

  const scoredPool = filtered.map(recipe => {
    let score = 100;
    if (state.cravings.trim() !== '') {
      const tokens = state.cravings.toLowerCase().split(/\s+/).filter(t => t.length > 1);
      let matchCount = 0;
      tokens.forEach(token => {
        if (recipe.name.toLowerCase().includes(token)) matchCount += 4;
      });
      score += matchCount * 15;
    }

    const convertedRecipe = {
      ...recipe,
      costPerServing: recipe.costPerServing * USD_TO_INR,
      ingredients: recipe.ingredients.map(ing => ({
        ...ing,
        cost: ing.cost * USD_TO_INR
      }))
    };

    return { recipe: convertedRecipe, score };
  });

  scoredPool.sort((a, b) => b.score - a.score);
  const pool = scoredPool.map(item => item.recipe);
  state.recipePools[slot] = pool;
  state.poolIndices[slot] = 0;

  if (pool.length > 0) {
    state.selectedMeals[slot] = pool[0];
  } else {
    const rawRecipes = recipes.filter(r => r.mealType === slot);
    const convertedRaw = rawRecipes.map(recipe => ({
      ...recipe,
      costPerServing: recipe.costPerServing * USD_TO_INR,
      ingredients: recipe.ingredients.map(ing => ({
        ...ing,
        cost: ing.cost * USD_TO_INR
      }))
    }));
    state.recipePools[slot] = convertedRaw;
    state.selectedMeals[slot] = convertedRaw[0] || null;
  }
}

function shuffleMealSlot(mealType) {
  const pool = state.recipePools[mealType];
  if (pool.length <= 1) {
    showToast(`No other recipe found for ${mealType} under current filters.`, true);
    return;
  }

  state.poolIndices[mealType] = (state.poolIndices[mealType] + 1) % pool.length;
  state.selectedMeals[mealType] = pool[state.poolIndices[mealType]];

  Object.keys(state.activeSubstitutions).forEach(key => {
    if (key.startsWith(mealType + '_')) {
      delete state.activeSubstitutions[key];
    }
  });

  showToast(`Swapped: ${state.selectedMeals[mealType].name}`);
  renderMealPlanCards();
  renderGroceryList();
  generateTimeline();
  calculateCostsAndFeasibility();
}

/* -------------------------------------------------------------
   Cost & Feasibility Calculations
------------------------------------------------------------- */
function calculateCostsAndFeasibility() {
  let totalCost = 0;

  const slots = ['breakfast', 'lunch', 'dinner'];
  slots.forEach(slot => {
    const recipe = state.selectedMeals[slot];
    if (!recipe) return;

    recipe.ingredients.forEach(ing => {
      const subKey = `${slot}_${ing.id}`;
      const activeSub = state.activeSubstitutions[subKey];
      const checkId = `${slot}_${ing.id}_check`;
      
      // If the user already has the ingredient checked off, it is free!
      const isChecked = state.checkedIngredients.has(checkId);
      const itemCost = isChecked 
        ? 0 
        : (activeSub ? ing.cost + (activeSub.costDiff * USD_TO_INR) : ing.cost);
      
      totalCost += itemCost;
    });
  });

  totalCost *= state.portions;

  elements.resultsTotalCost.textContent = `₹${totalCost.toFixed(0)}`;

  elements.resultsBudgetBadge.className = 'cost-status-badge';

  if (totalCost <= state.budgetLimit) {
    elements.resultsBudgetBadge.classList.add('feasible');
    elements.resultsBudgetBadge.textContent = 'Within Budget';
  } else if (totalCost <= state.budgetLimit * 1.2) {
    elements.resultsBudgetBadge.classList.add('warning');
    elements.resultsBudgetBadge.textContent = 'Tight';
  } else {
    elements.resultsBudgetBadge.classList.add('danger');
    elements.resultsBudgetBadge.textContent = 'Over Budget';
  }

  let totalPrep = 0;
  slots.forEach(slot => {
    const meal = state.selectedMeals[slot];
    if (meal) totalPrep += meal.prepTime;
  });

  elements.timelinePrepVal.textContent = `${totalPrep}m prep`;

  if (totalPrep <= 25) {
    elements.timelineDiffVal.textContent = 'Easy / Quick';
  } else if (totalPrep <= 45) {
    elements.timelineDiffVal.textContent = 'Moderate';
  } else {
    elements.timelineDiffVal.textContent = 'Elaborate';
  }

  const pacingBadgeText = state.schedule.charAt(0).toUpperCase() + state.schedule.slice(1) + ' schedule';
  elements.timelinePacingVal.textContent = pacingBadgeText;

  lucide.createIcons();
}

/* -------------------------------------------------------------
   Step 4 Renderer modules
------------------------------------------------------------- */
function renderMealPlanCards() {
  const slots = ['breakfast', 'lunch', 'dinner'];

  slots.forEach(slot => {
    const container = document.querySelector(`#col-${slot} .meal-card-target-div`);
    const meal = state.selectedMeals[slot];

    if (!meal) {
      container.innerHTML = `
        <div class="no-meals-state">
          <i data-lucide="ban"></i>
          <p>No matching recipe.</p>
        </div>
      `;
      return;
    }

    const activeMatchTags = meal.tags.filter(t => state.selectedDiets.has(t));
    const nonMatchTags = meal.tags.filter(t => !state.selectedDiets.has(t));

    let tagsHTML = activeMatchTags.map(t => `<span class="meal-tag match-tag"><i data-lucide="check"></i> ${t}</span>`).join('');
    tagsHTML += nonMatchTags.map(t => `<span class="meal-tag">${t}</span>`).join('');

    let matchPercentage = 80;
    if (state.cravings.trim() !== '') {
      const tokens = state.cravings.toLowerCase().split(/\s+/).filter(t => t.length > 1);
      let matchCount = 0;
      tokens.forEach(token => {
        if (meal.name.toLowerCase().includes(token)) matchCount += 2;
        if (meal.ingredients.some(i => i.name.toLowerCase().includes(token))) matchCount += 1;
      });
      matchPercentage = Math.min(80 + (matchCount * 10), 100);
    } else {
      matchPercentage = 85 + (activeMatchTags.length * 5);
      matchPercentage = Math.min(matchPercentage, 100);
    }

    let foodEmoji = '🥣';
    if (slot === 'breakfast') foodEmoji = '🍳';
    if (slot === 'lunch') foodEmoji = '🥗';
    if (slot === 'dinner') foodEmoji = '🥩';

    const imageHTML = meal.image
      ? `<img src="${meal.image}" alt="${meal.name}" class="meal-card-img-element">`
      : `<span class="meal-emoji">${foodEmoji}</span>`;

    container.innerHTML = `
      <div class="meal-card" data-recipe-id="${meal.id}">
        <div class="meal-card-img">
          ${imageHTML}
        </div>
        <div class="meal-card-content">
          <div class="meal-card-header-row">
            <h4 class="meal-card-title">${meal.name}</h4>
            <span class="match-score-badge">${matchPercentage}% Fit</span>
          </div>
          <div class="meal-card-tags">
            ${tagsHTML}
          </div>
          <div class="meal-card-footer">
            <div class="meal-stats-row">
              <div class="meal-stat-badge">
                <i data-lucide="timer"></i>
                <span>${meal.prepTime}m</span>
              </div>
              <div class="meal-stat-badge">
                <i data-lucide="indian-rupee"></i>
                <span>₹${(meal.ingredients.reduce((acc, i) => acc + i.cost, 0)).toFixed(0)}</span>
              </div>
            </div>
            <button class="btn-view-details" data-recipe-id="${meal.id}" data-slot="${slot}">
              Recipe details <i data-lucide="arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const recipeId = btn.getAttribute('data-recipe-id');
      const slot = btn.getAttribute('data-slot');
      openRecipeDetailsModal(recipeId, slot);
    });
  });

  lucide.createIcons();
}

function openRecipeDetailsModal(recipeId, slot) {
  const allMeals = [...state.recipePools.breakfast, ...state.recipePools.lunch, ...state.recipePools.dinner, ...recipes];
  const recipe = allMeals.find(r => r.id === recipeId);
  if (!recipe) return;

  const ingredientsHTML = recipe.ingredients.map(ing => {
    const subKey = `${slot}_${ing.id}`;
    const activeSub = state.activeSubstitutions[subKey];
    const name = activeSub ? `${activeSub.name} (Swap)` : ing.name;
    const cost = (activeSub ? ing.cost + (activeSub.costDiff * USD_TO_INR) : ing.cost) * state.portions;

    return `
      <div class="modal-ing-item">
        <span>${name}</span>
        <span class="qty">${ing.amount} (₹${cost.toFixed(0)})</span>
      </div>
    `;
  }).join('');

  const stepsHTML = recipe.steps.map((step, idx) => `
    <div class="modal-step-item">
      <div class="modal-step-num">${idx + 1}</div>
      <div>
        <p>${step.action}</p>
        <span class="task-recipe-origin"><i data-lucide="clock" style="width:10px;height:10px;display:inline;"></i> ${step.duration} mins</span>
      </div>
    </div>
  `).join('');

  elements.modalBodyContent.innerHTML = `
    <div class="modal-recipe-header">
      <h2>${recipe.name}</h2>
      <div class="modal-recipe-tags">
        ${recipe.tags.map(t => `<span class="meal-tag match-tag">${t}</span>`).join('')}
      </div>
    </div>
    <p class="modal-recipe-desc">${recipe.description}</p>
    
    <h3 class="modal-section-title"><i data-lucide="shopping-basket"></i> Ingredients Needed (${state.portions} Portions)</h3>
    <div class="modal-ingredients-list">
      ${ingredientsHTML}
    </div>

    <h3 class="modal-section-title"><i data-lucide="clock"></i> Kitchen Preparation Steps</h3>
    <div class="modal-steps-list">
      ${stepsHTML}
    </div>
  `;

  elements.detailsModal.classList.add('active');
  lucide.createIcons();
}

function isIngredientEssential(ingName, recipeName) {
  const ing = ingName.toLowerCase();
  const rec = recipeName.toLowerCase();
  
  if (rec.includes(ing) || ing.includes(rec)) return true;
  
  const ingTokens = ing.split(/\s+/).filter(t => t.length > 3);
  const overlap = ingTokens.some(t => rec.includes(t));
  if (overlap) return true;

  const essentialKeywords = [
    'chicken', 'beef', 'salmon', 'shrimp', 'pork', 'bacon', 'turkey', 'fish', 'seafood',
    'egg', 'tofu', 'tempeh', 'lentils', 'chickpea', 'avocado', 'chia', 'quinoa',
    'spaghetti', 'pasta', 'noodle', 'mushroom', 'flour', 'banana', 'bread', 'sourdough'
  ];
  return essentialKeywords.some(kw => ing.includes(kw));
}

function renderGroceryList() {
  const itemsByCategory = {};
  const slots = ['breakfast', 'lunch', 'dinner'];

  slots.forEach(slot => {
    const meal = state.selectedMeals[slot];
    if (!meal) return;

    meal.ingredients.forEach(ing => {
      const cat = ing.category || 'Other';
      if (!itemsByCategory[cat]) {
        itemsByCategory[cat] = [];
      }

      const subKey = `${slot}_${ing.id}`;
      const activeSub = state.activeSubstitutions[subKey];
      const displayName = activeSub ? activeSub.name : ing.name;
      
      const checkId = `${slot}_${ing.id}_check`;
      const isChecked = state.checkedIngredients.has(checkId);
      
      const finalCost = isChecked 
        ? 0 
        : (activeSub ? ing.cost + (activeSub.costDiff * USD_TO_INR) : ing.cost) * state.portions;

      const isEssential = isIngredientEssential(ing.name, meal.name);

      itemsByCategory[cat].push({
        checkId,
        displayName,
        amount: ing.amount,
        finalCost,
        isSwapped: !!activeSub,
        isEssential,
        originalIng: ing,
        activeSub,
        slot
      });
    });
  });

  elements.groceriesListTarget.innerHTML = '';
  const categories = Object.keys(itemsByCategory);
  if (categories.length === 0) {
    elements.groceriesListTarget.innerHTML = `
      <div class="no-meals-state">
        <i data-lucide="shopping-cart"></i>
        <p>No groceries to compile.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  categories.forEach(category => {
    const aisleCard = document.createElement('div');
    aisleCard.className = 'aisle-card';
    
    let categoryIcon = 'package';
    if (category.toLowerCase().includes('produce')) categoryIcon = 'sprout';
    if (category.toLowerCase().includes('meat') || category.toLowerCase().includes('sea') || category.toLowerCase().includes('fish')) categoryIcon = 'beef';
    if (category.toLowerCase().includes('dairy') || category.toLowerCase().includes('egg') || category.toLowerCase().includes('cheese')) categoryIcon = 'egg';
    if (category.toLowerCase().includes('pantry') || category.toLowerCase().includes('spices')) categoryIcon = 'container';
    if (category.toLowerCase().includes('bakery') || category.toLowerCase().includes('bread')) categoryIcon = 'croissant';

    const itemsHTML = itemsByCategory[category].map(item => {
      const isChecked = state.checkedIngredients.has(item.checkId);
      
      let selectHTML = '';
      if (item.originalIng.substitutionId && substitutions[item.originalIng.substitutionId]) {
        const options = substitutions[item.originalIng.substitutionId];
        selectHTML = `
          <select class="grocery-inline-select" data-slot="${item.slot}" data-ingredient-id="${item.originalIng.id}" data-sub-id="${item.originalIng.substitutionId}">
            <option value="original">Original: ${item.originalIng.name}</option>
            ${options.map(opt => {
              const diffCost = opt.costDiff * USD_TO_INR;
              const diffText = diffCost >= 0 ? `+₹${diffCost.toFixed(0)}` : `-₹${Math.abs(diffCost).toFixed(0)}`;
              return `<option value="${opt.id}" ${item.activeSub && item.activeSub.id === opt.id ? 'selected' : ''}>Swap: ${opt.name} (${diffText})</option>`;
            }).join('')}
          </select>
        `;
      }

      const essentialHTML = item.isEssential 
        ? `<span class="essential-badge" title="Core recipe ingredient!"><i data-lucide="star"></i> Core</span>`
        : '';

      return `
        <div class="grocery-check-row ${isChecked ? 'checked' : ''}" data-check-id="${item.checkId}">
          <div class="grocery-left-flex">
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox-input" ${isChecked ? 'checked' : ''} data-check-id="${item.checkId}">
              <div class="checkbox-visual">
                <i data-lucide="check"></i>
              </div>
              <span class="item-text">${item.displayName}</span>
            </label>
            ${essentialHTML}
            ${selectHTML}
          </div>
          <div>
            <span class="item-quantity">${item.amount}</span>
            <span class="item-price">₹${item.finalCost.toFixed(0)}</span>
          </div>
        </div>
      `;
    }).join('');

    aisleCard.innerHTML = `
      <h4 class="aisle-title"><i data-lucide="${categoryIcon}"></i> ${category}</h4>
      <div class="grocery-item-list">
        ${itemsHTML}
      </div>
    `;

    elements.groceriesListTarget.appendChild(aisleCard);
  });

  document.querySelectorAll('.grocery-item-list input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const checkId = e.target.getAttribute('data-check-id');
      const row = document.querySelector(`.grocery-check-row[data-check-id="${checkId}"]`);
      
      if (e.target.checked) {
        state.checkedIngredients.add(checkId);
        row.classList.add('checked');
      } else {
        state.checkedIngredients.delete(checkId);
        row.classList.remove('checked');
      }
      calculateCostsAndFeasibility();
      renderGroceryList();
    });
  });

  document.querySelectorAll('.grocery-inline-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const slot = select.getAttribute('data-slot');
      const ingId = select.getAttribute('data-ingredient-id');
      const subId = select.getAttribute('data-sub-id');
      const selectedValue = e.target.value;
      const subKey = `${slot}_${ingId}`;

      if (selectedValue === 'original') {
        delete state.activeSubstitutions[subKey];
        showToast("Restored original ingredient");
      } else {
        const option = substitutions[subId].find(opt => opt.id === selectedValue);
        if (option) {
          state.activeSubstitutions[subKey] = option;
          showToast(`Swapped to: ${option.name}`);
        }
      }
      
      calculateCostsAndFeasibility();
      renderGroceryList();
    });
  });

  lucide.createIcons();
}

function generateTimeline() {
  elements.timelineTasksTarget.innerHTML = '';
  const tasksList = [];

  if (state.schedule === 'busy') {
    const morningPrepTasks = [];
    const mealCookTasks = { breakfast: [], lunch: [], dinner: [] };

    ['breakfast', 'lunch', 'dinner'].forEach(slot => {
      const meal = state.selectedMeals[slot];
      if (!meal) return;

      meal.steps.forEach(step => {
        const taskInfo = {
          recipeName: meal.name,
          action: step.action,
          duration: step.duration,
          stage: step.stage
        };

        if (step.stage === 'prep') {
          morningPrepTasks.push(taskInfo);
        } else {
          mealCookTasks[slot].push(taskInfo);
        }
      });
    });

    if (morningPrepTasks.length > 0) {
      morningPrepTasks.forEach((t, idx) => {
        tasksList.push({
          id: `busy_prep_${idx}`,
          time: '08:00 AM',
          timeLabel: 'Morning Prep',
          action: t.action,
          recipeName: t.recipeName,
          duration: t.duration
        });
      });
    }

    if (mealCookTasks.breakfast.length > 0) {
      mealCookTasks.breakfast.forEach((t, idx) => {
        tasksList.push({
          id: `busy_bf_${idx}`,
          time: '08:20 AM',
          timeLabel: 'Breakfast Cook',
          action: t.action,
          recipeName: t.recipeName,
          duration: t.duration
        });
      });
    }

    if (mealCookTasks.lunch.length > 0) {
      mealCookTasks.lunch.forEach((t, idx) => {
        tasksList.push({
          id: `busy_lh_${idx}`,
          time: '12:30 PM',
          timeLabel: 'Lunch Cook',
          action: t.action,
          recipeName: t.recipeName,
          duration: t.duration
        });
      });
    }

    if (mealCookTasks.dinner.length > 0) {
      mealCookTasks.dinner.forEach((t, idx) => {
        tasksList.push({
          id: `busy_dn_${idx}`,
          time: '07:00 PM',
          timeLabel: 'Dinner Cook',
          action: t.action,
          recipeName: t.recipeName,
          duration: t.duration
        });
      });
    }

  } else {
    const times = {
      breakfast: { base: '08:00 AM', label: 'Breakfast' },
      lunch: { base: '12:30 PM', label: 'Lunch' },
      dinner: { base: '06:30 PM', label: 'Dinner' }
    };

    ['breakfast', 'lunch', 'dinner'].forEach(slot => {
      const meal = state.selectedMeals[slot];
      if (!meal) return;

      meal.steps.forEach((step, idx) => {
        tasksList.push({
          id: `std_${slot}_${idx}`,
          time: times[slot].base,
          timeLabel: times[slot].label,
          action: step.action,
          recipeName: meal.name,
          duration: step.duration
        });
      });
    });
  }

  if (tasksList.length === 0) {
    elements.timelineTasksTarget.innerHTML = `
      <div class="no-meals-state">
        <i data-lucide="chef-hat"></i>
        <p>No tasks to compile.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  tasksList.forEach(task => {
    const isCompleted = state.completedTasks.has(task.id);
    const row = document.createElement('div');
    row.className = `timeline-task-row ${isCompleted ? 'completed' : ''}`;
    row.setAttribute('data-task-id', task.id);

    row.innerHTML = `
      <div class="timeline-bullet"></div>
      <div class="task-time-badge">${task.time}</div>
      <div class="task-details-col">
        <label class="checkbox-label">
          <input type="checkbox" class="checkbox-input timeline-chk" ${isCompleted ? 'checked' : ''} data-task-id="${task.id}">
          <div class="checkbox-visual">
            <i data-lucide="check"></i>
          </div>
          <span class="task-text">${task.action}</span>
        </label>
        <span class="task-recipe-origin">Originating from: ${task.recipeName} (${task.timeLabel})</span>
      </div>
      <div class="task-duration"><i data-lucide="timer"></i> ${task.duration}m</div>
    `;

    elements.timelineTasksTarget.appendChild(row);
  });

  document.querySelectorAll('.timeline-chk').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const taskId = e.target.getAttribute('data-task-id');
      const row = document.querySelector(`.timeline-task-row[data-task-id="${taskId}"]`);

      if (e.target.checked) {
        state.completedTasks.add(taskId);
        row.classList.add('completed');
      } else {
        state.completedTasks.delete(taskId);
        row.classList.remove('completed');
      }

      updateProgressBar(tasksList.length);
    });
  });

  updateProgressBar(tasksList.length);
  lucide.createIcons();
}

function updateProgressBar(totalTasks) {
  const completedCount = state.completedTasks.size;
  elements.lblProgressCount.textContent = `${completedCount} / ${totalTasks}`;
  const pct = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  elements.timelineProgressFill.style.width = `${pct}%`;

  if (completedCount === totalTasks && totalTasks > 0) {
    showToast("🎉 Perfect! You are fully prepped and ready.");
  }
}
