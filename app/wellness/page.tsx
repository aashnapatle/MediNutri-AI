"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  BookOpen,
  Apple,
  Clock,
  ArrowRight,
  Flame,
  Salad,
  Info,
} from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

interface LibraryItem {
  id: string
  title: string
  category: string
  tag: string
  readTime: string
  summary: string
  fullContent: string
  icon: any
  emoji: string
}

const dietPlans: LibraryItem[] = [
  {
    id: "indian-veg",
    title: "Balanced Indian Vegetarian Plan",
    category: "Diet Plan",
    tag: "High Fiber",
    readTime: "4 min read",
    icon: Salad,
    emoji: "🥗",
    summary: "Roti, dal, paneer, seasonal sabzi, curd, and sprouts providing full amino-acid balance without meat.",
    fullContent: `The traditional Indian thali has immense nutritional intelligence when portioned well:
• Breakfast: Moong dal chilla with mint chutney, or vegetable poha topped with roasted peanuts.
• Lunch: 2 whole-wheat rotis, 1 cup cooked dal (toor or masoor), 1 cup green sabzi (palak/methi), and a bowl of probiotic curd.
• Evening Snack: Handful of roasted makhana (foxnuts) or roasted chana with masala chaas.
• Dinner: Light khichdi with mixed vegetables and a spoon of cow ghee, or paneer tikka with sautéed capsicum.`,
  },
  {
    id: "high-protein",
    title: "High-Protein Muscle Support",
    category: "Diet Plan",
    tag: "Fitness",
    readTime: "5 min read",
    icon: Flame,
    emoji: "🍗",
    summary: "Targets 1.6–2.0g protein per kg with eggs, chicken breast, paneer, tofu, and legumes.",
    fullContent: `Protein is vital for muscle repair, enzymatic activity, and satiety:
• Daily Target: Aim for 25–35g protein per main meal to trigger muscle protein synthesis.
• Options for Vegetarians: Paneer, sattu drink, Greek yogurt, edamame, tofu, lentils paired with grains.
• Options for Non-Vegetarians: Boiled egg whites, grilled chicken breast, fish curries with low oil.
• Hydration note: Higher protein intake requires adequate water intake (min 8 glasses) for optimal renal clearance.`,
  },
  {
    id: "plant-vegan",
    title: "Clean Plant-Based Vegan Guide",
    category: "Diet Plan",
    tag: "Plant Power",
    readTime: "4 min read",
    icon: Apple,
    emoji: "🌱",
    summary: "Whole grains, legumes, nuts, seeds, and leafy greens fulfilling complete macro & micronutrient needs.",
    fullContent: `A vibrant whole-food plant-based approach:
• Key Micronutrients to watch: Vitamin B12, Iron, Zinc, Calcium, and Omega-3 (from chia/flax seeds).
• Sample Plate: Quinoa or brown rice with chickpea curry (chole), steamed broccoli, and tahini dressing.
• Tip: Combine plant-based iron sources (spinach, lentils) with vitamin C (lemon juice, tomatoes) to maximize absorption.`,
  },
  {
    id: "fat-loss",
    title: "Sustainable Fat Loss Framework",
    category: "Diet Plan",
    tag: "Caloric Deficit",
    readTime: "4 min read",
    icon: Flame,
    emoji: "🏃",
    summary: "A gentle 300–400 kcal deficit focusing on volume eating with vegetables, lean proteins, and hydration.",
    fullContent: `Crash dieting causes metabolic adaptation and rapid rebound. Instead:
• Target a gentle 15-20% caloric deficit from your maintenance TDEE.
• Volume Eating: Double your green vegetable intake to maintain stomach fullness without calorie density.
• Never eliminate an entire food group; focus on sustainable habits you can maintain for years.`,
  },
]

const mealIdeas: LibraryItem[] = [
  {
    id: "oats-bowl",
    title: "Overnight Chia & Berry Oats",
    category: "Breakfast Idea",
    tag: "Under 350 kcal",
    readTime: "3 min prep",
    icon: Apple,
    emoji: "🥣",
    summary: "Rolled oats soaked in almond milk with chia seeds, topped with berries and sliced almonds.",
    fullContent: `Nutrient Breakdown:
• ~320 kcal | 11g Protein | 45g Carbs | 9g Healthy Fats
• Ingredients: 40g rolled oats, 1 tsp chia seeds, 150ml unsweetened almond milk, 30g fresh blueberries, 5 chopped almonds, pinch of cinnamon.
• Preparation: Mix oats, chia seeds, and milk in a mason jar. Refrigerate overnight. Top with fresh berries before eating.`,
  },
  {
    id: "paneer-wrap",
    title: "Grilled Paneer & Veggie Roti Wrap",
    category: "Lunch Idea",
    tag: "Protein Rich",
    readTime: "10 min prep",
    icon: Salad,
    emoji: "🌯",
    summary: "Tava-grilled paneer cubes tossed in chat masala, wrapped in a whole-wheat roti with mint curd dressing.",
    fullContent: `Nutrient Breakdown:
• ~410 kcal | 22g Protein | 38g Carbs | 16g Fat
• Ingredients: 1 whole wheat roti, 75g low-fat paneer, shredded cabbage, bell peppers, sliced onions, 2 tbsp mint-yogurt chutney.
• Method: Sauté paneer and bell peppers on a hot pan with minimal olive oil spray. Warm the roti, lay the filling, drizzle mint yogurt, roll tightly.`,
  },
  {
    id: "lentil-soup",
    title: "Spiced Masoor Lentil & Spinach Soup",
    category: "Dinner Idea",
    tag: "Comforting",
    readTime: "15 min cook",
    icon: Salad,
    emoji: "🍲",
    summary: "Red lentils simmered with garlic, turmeric, ginger, and fresh spinach. Warm, comforting, and light.",
    fullContent: `Nutrient Breakdown:
• ~280 kcal | 16g Protein | 42g Carbs | 3g Fat
• Ingredients: 1/2 cup red masoor dal, 1 cup washed spinach leaves, 2 cloves minced garlic, 1/2 tsp jeera, turmeric, pink salt, squeeze of lemon.
• Health Benefit: Red lentils cook quickly without pre-soaking and are gentle on the digestive system before bedtime.`,
  },
]

const wellnessGuides: LibraryItem[] = [
  {
    id: "water-guide",
    title: "The Science of Hydration & Metabolism",
    category: "Hydration Guide",
    tag: "Daily Habit",
    readTime: "3 min read",
    icon: Salad,
    emoji: "💧",
    summary: "How proper hydration optimizes cellular metabolic efficiency and supports hunger regulation.",
    fullContent: `Water is the biological medium for every metabolic reaction in the human body:
• Thermogenic Effect: Drinking 500ml of cold/room temp water can temporarily increase resting energy expenditure by 10-30% for about an hour.
• Thirst vs Hunger Confusion: The hypothalamus controls both thirst and hunger. Mild dehydration often masquerades as sugar cravings.
• Golden Rule: Sip consistently through the day rather than chugging liters at once. Aim for pale straw-colored urine.`,
  },
  {
    id: "fiber-guide",
    title: "Fiber: Your Gut Microbiome's Fuel",
    category: "Gut Health",
    tag: "Longevity",
    readTime: "4 min read",
    icon: Salad,
    emoji: "🌾",
    summary: "Soluble and insoluble fiber roles in blunting glucose spikes and producing short-chain fatty acids.",
    fullContent: `Why fiber is the unsung hero of lifelong health:
• Soluble Fiber (oats, beans, apples) forms a viscous gel that slows carbohydrate digestion and blunts postprandial glucose spikes.
• Insoluble Fiber (wheat bran, seeds, vegetable skins) adds bulk to stool and speeds intestinal transit.
• Daily Goal: Aim for 25–35 grams per day. Increase intake gradually alongside plenty of water to prevent digestive distress.`,
  },
  {
    id: "sleep-hunger",
    title: "Sleep Deprivation & Ghrelin Spikes",
    category: "Lifestyle",
    tag: "Hormones",
    readTime: "4 min read",
    icon: Salad,
    emoji: "😴",
    summary: "How sleeping under 7 hours drives hunger hormones ghrelin and decreases leptin satiety signals.",
    fullContent: `The hormonal link between sleep and appetite:
• Sleeping less than 6 hours elevates circulating ghrelin (the hunger-stimulating hormone) by ~15% and suppresses leptin (the fullness hormone).
• Prefrontal Cortex Impairment: Sleep debt reduces executive decision-making, significantly increasing cravings for ultra-processed high-carb foods.
• Action: Prioritize 7 to 8 hours of quality sleep in a cool, dark room as a non-negotiable health pillar.`,
  },
]

export default function WellnessPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"plans" | "meals" | "articles">("plans")
  const [selectedArticle, setSelectedArticle] = useState<LibraryItem | null>(null)

  const getList = () => {
    switch (activeTab) {
      case "plans":
        return dietPlans
      case "meals":
        return mealIdeas
      case "articles":
        return wellnessGuides
    }
  }

  return (
    <DashboardLayout title={t("wellnessTitle")} subtitle={t("wellnessSubtitle")}>
      <div className="space-y-6">

        {/* ── HERO BANNER ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/95 border border-[#E5E7DE] shadow-xs">
          <div>
            <h2 className="text-2xl font-bold text-[#172C23] font-serif flex items-center gap-2.5">
              <span>📚</span> {t("wellnessTitle")}
            </h2>
            <p className="text-xs text-[#63736A] mt-1 font-normal">
              {t("wellnessSubtitle")}
            </p>
          </div>
        </div>

        {/* ── TAB SWITCHER (PREMIUM PILLS) ── */}
        <div className="flex flex-wrap items-center gap-2.5 p-1.5 rounded-2xl bg-white/90 border border-[#E5E7DE] w-fit shadow-2xs">
          <button
            onClick={() => setActiveTab("plans")}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "plans"
                ? "bg-[#173B2D] text-white shadow-xs"
                : "text-[#63736A] hover:text-[#172C23]"
            }`}
          >
            {t("dietPlansTab")} 🥗
          </button>
          <button
            onClick={() => setActiveTab("meals")}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "meals"
                ? "bg-[#173B2D] text-white shadow-xs"
                : "text-[#63736A] hover:text-[#172C23]"
            }`}
          >
            {t("mealIdeasTab")} 🍳
          </button>
          <button
            onClick={() => setActiveTab("articles")}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "articles"
                ? "bg-[#173B2D] text-white shadow-xs"
                : "text-[#63736A] hover:text-[#172C23]"
            }`}
          >
            {t("articlesTab")} 💧
          </button>
        </div>

        {/* ── CONTENT GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {getList().map((item) => (
            <Card
              key={item.id}
              className="nature-card p-6 bg-white/95 border border-[#E5E7DE] rounded-3xl shadow-xs flex flex-col justify-between group cursor-pointer hover:border-[#7EAA82]"
              onClick={() => setSelectedArticle(item)}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5F0DF] text-[#2E6B40] uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <span className="text-[11px] font-medium text-[#63736A] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.readTime}
                  </span>
                </div>

                <div className="flex items-start gap-3 mt-1">
                  <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
                  <h3 className="text-base font-bold text-[#172C23] font-serif leading-snug group-hover:text-[#38664F] transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-[#63736A] mt-2.5 leading-relaxed font-normal">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#E5E7DE] flex items-center justify-between text-[#173B2D] font-bold text-xs group-hover:translate-x-1 transition-transform">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[#7EAA82]" />
                  <span>{t("readGuide")}</span>
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-2xl bg-white/80 border border-[#E5E7DE] flex items-start gap-3">
          <Info className="h-4 w-4 text-[#7EAA82] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#63736A] leading-relaxed italic">
            All diet plans, meal ideas, and wellness articles are for educational wellness reference and do not replace individual clinical medical prescriptions.
          </p>
        </div>

      </div>

      {/* ── MODAL: ARTICLE READER ── */}
      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-6 border-[#E5E7DE] bg-white shadow-xl max-h-[85vh] overflow-y-auto">
          {selectedArticle && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5F0DF] text-[#2E6B40] uppercase tracking-wider">
                  {selectedArticle.tag}
                </span>
                <span className="text-xs text-[#63736A] flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedArticle.readTime}
                </span>
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-bold text-[#172C23] font-serif flex items-center gap-2.5">
                <span>{selectedArticle.emoji}</span>
                <span>{selectedArticle.title}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-[#63736A]">
                {selectedArticle.category} · Evidence-backed health information
              </DialogDescription>

              <div className="p-4 rounded-2xl bg-[#FAF8F0] border border-[#E5E7DE] text-xs text-[#172C23] leading-relaxed whitespace-pre-line font-normal">
                {selectedArticle.fullContent}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}