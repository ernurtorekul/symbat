import OpenAI from 'openai';
import type { Product } from '../types/quiz';

// Initialize OpenAI only if API key is available and valid
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = apiKey &&
  apiKey !== 'your_openai_api_key_here' &&
  apiKey.startsWith('sk-proj')
  ? new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Allow client-side usage for demo purposes
    })
  : null;

export interface ChatBotResponse {
  text: string;
  products?: Product[];
  quickActions?: string[];
}

export class ChatbotService {
  private products: Product[] = [];
  private userQuizData?: any;

  constructor(products: Product[], userQuizData?: any) {
    this.products = products;
    this.userQuizData = userQuizData;
  }

  async generateResponse(userMessage: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []): Promise<ChatBotResponse> {
    // If OpenAI is not configured, fall back to rule-based responses
    if (!openai) {
      return this.generateRuleBasedResponse(userMessage);
    }

    try {
      // Create system prompt with context about the user and available products
      const systemPrompt = this.createSystemPrompt();

      // Build conversation context
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user' as const, content: userMessage }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

      // Parse the response to extract product recommendations and quick actions
      return this.parseAIResponse(aiResponse);

    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Fall back to rule-based responses on error
      return this.generateRuleBasedResponse(userMessage);
    }
  }

  private createSystemPrompt(): string {
    const userInfo = this.userQuizData ? `
User Profile:
- Skin Type: ${this.userQuizData.skinType}
- Skin Tone: ${this.userQuizData.skinTone}
- Skin Concerns: ${this.userQuizData.skinConcerns?.join(', ') || 'None specified'}
- Allergies: ${this.userQuizData.allergies?.join(', ') || 'None specified'}
` : 'No user quiz data available.';

    const productInfo = `
Available Products: ${this.products.length} makeup products from various brands including ColourPop, Deciem, Boosh, and more.
Price ranges: Budget ($1-$15), Mid ($15-$40), Premium ($40+)
Categories: Foundation, Concealer, Blush, Eyeshadow, Lipstick, Skincare, etc.
Features: Cruelty-free, Organic, Hypoallergenic, Non-comedogenic options available
`;

    return `You are a Smart Beauty Assistant, an expert in makeup and skincare. You help users find the perfect products based on their skin type, concerns, and preferences.

${userInfo}

${productInfo}

Your role:
1. Provide personalized product recommendations based on the user's skin profile
2. Explain ingredients and their benefits
3. Give skincare and makeup application advice
4. Consider budget preferences and brand preferences
5. Be friendly, knowledgeable, and helpful

Guidelines:
- Always consider the user's skin type and concerns when recommending products
- If recommending products, mention the product name, brand, key benefits, and price
- Suggest 2-3 products maximum per recommendation
- Include product IDs in format [Product ID: XYZ] for products you recommend
- End with relevant quick action suggestions
- If you don't have specific user data, ask clarifying questions
- Never make up product information - only recommend from available products`;
  }

  private parseAIResponse(response: string): ChatBotResponse {
    const result: ChatBotResponse = {
      text: response,
      products: [],
      quickActions: []
    };

    // Extract product IDs from the response
    const productIds = response.match(/\[Product ID: ([^\]]+)\]/g);
    if (productIds) {
      const extractedIds = productIds.map(match => match.replace('[Product ID: ', '').replace(']', ''));
      result.products = this.products.filter(product =>
        extractedIds.includes(product.id)
      ).slice(0, 3); // Limit to 3 products

      // Clean up the response text by removing product ID markers
      result.text = response.replace(/\[Product ID: [^\]]+\]/g, '');
    }

    // Auto-generate quick actions based on response content
    if (response.toLowerCase().includes('skin type')) {
      result.quickActions?.push("What's best for oily skin?", "Dry skin recommendations");
    }
    if (response.toLowerCase().includes('ingredient')) {
      result.quickActions?.push("Tell me about retinol", "What about vitamin C?");
    }
    if (response.toLowerCase().includes('budget') || response.toLowerCase().includes('price')) {
      result.quickActions?.push("Show budget options", "Premium products");
    }
    if (response.toLowerCase().includes('acne') || response.toLowerCase().includes('blemish')) {
      result.quickActions?.push("Acne solutions", "What causes breakouts?");
    }

    // Add default actions if no specific ones were generated
    if (!result.quickActions || result.quickActions.length === 0) {
      result.quickActions = ["Find products for my skin type", "Compare products", "Tell me about ingredients"];
    }

    return result;
  }

  findProductsByCategory(category: string): Product[] {
    return this.products.filter(product =>
      product.productCategory?.toLowerCase().includes(category.toLowerCase()) ||
      product.productType?.toLowerCase().includes(category.toLowerCase())
    ).slice(0, 5);
  }

  findProductsBySkinType(skinType: string): Product[] {
    const skinTypeLower = skinType.toLowerCase();
    return this.products.filter(product => {
      const description = product.description?.toLowerCase() || '';
      const tags = product.tagList?.map(tag => tag.toLowerCase()).join(' ') || '';

      return description.includes(skinTypeLower) ||
             tags.includes(skinTypeLower) ||
             (skinTypeLower === 'oily' && (tags.includes('oil-free') || tags.includes('mattifying'))) ||
             (skinTypeLower === 'dry' && (tags.includes('hydrating') || tags.includes('moisturizing'))) ||
             (skinTypeLower === 'sensitive' && (product.isHypoallergenic || tags.includes('gentle')));
    }).slice(0, 5);
  }

  findProductsByBudget(budgetRange: string): Product[] {
    return this.products.filter(product =>
      product.budgetRange === budgetRange.toLowerCase()
    ).slice(0, 5);
  }

  private generateRuleBasedResponse(userMessage: string): ChatBotResponse {
    const input = userMessage.toLowerCase();
    let response = '';
    let recommendedProducts: Product[] = [];
    let quickActions: string[] = [];

    // Only show fallback notice if OpenAI is actually not configured
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const showFallbackNotice = !apiKey || apiKey === 'your_openai_api_key_here' || !apiKey.startsWith('sk-proj');
    const fallbackNotice = showFallbackNotice ? "🤖 *AI Mode: Currently using smart recommendations (OpenAI API not configured)*\n\n" : "";

    // Skin type recommendations
    if (input.includes('oily skin') || input.includes('oily')) {
      const oilyProducts = this.products.filter(p =>
        p.tagList?.includes('oil free') ||
        p.tagList?.includes('mattifying') ||
        p.description?.toLowerCase().includes('oily skin')
      ).slice(0, 3);
      recommendedProducts = oilyProducts;
      response = fallbackNotice + "I found some great products for oily skin! These are oil-free and help control shine:";
      quickActions = ["Show more oily skin products", "What about dry skin?", "Tell me about ingredients"];
    }
    // Dry skin recommendations
    else if (input.includes('dry skin') || input.includes('dry')) {
      const dryProducts = this.products.filter(p =>
        p.tagList?.includes('hydrating') ||
        p.tagList?.includes('moisturizing') ||
        p.description?.toLowerCase().includes('dry skin')
      ).slice(0, 3);
      recommendedProducts = dryProducts;
      response = fallbackNotice + "For dry skin, hydration is key! Here are some moisturizing products:";
      quickActions = ["More dry skin options", "What about sensitive skin?", "How to apply?"];
    }
    // Sensitive skin recommendations
    else if (input.includes('sensitive skin') || input.includes('sensitive')) {
      const sensitiveProducts = this.products.filter(p =>
        p.isHypoallergenic ||
        p.tagList?.includes('gentle') ||
        p.tagList?.includes('fragrance free')
      ).slice(0, 3);
      recommendedProducts = sensitiveProducts;
      response = fallbackNotice + "For sensitive skin, gentle formulas are essential! These hypoallergenic options are perfect:";
      quickActions = ["More sensitive skin products", "What ingredients to avoid?", "Patch test advice"];
    }
    // Budget recommendations
    else if (input.includes('budget') || input.includes('cheap') || input.includes('affordable')) {
      const budgetProducts = this.products.filter(p => p.budgetRange === 'budget').slice(0, 3);
      recommendedProducts = budgetProducts;
      response = fallbackNotice + "Here are some amazing budget-friendly options that don't compromise on quality:";
      quickActions = ["Show premium options", "What's the difference?", "Drugstore vs high-end"];
    }
    // Acne concerns
    else if (input.includes('acne') || input.includes('breakout') || input.includes('blemish')) {
      const acneProducts = this.products.filter(p =>
        p.isNonComedogenic ||
        p.tagList?.includes('acne') ||
        p.tagList?.includes('salicylic acid')
      ).slice(0, 3);
      recommendedProducts = acneProducts;
      response = fallbackNotice + "For acne-prone skin, non-comedogenic products are crucial! These won't clog your pores:";
      quickActions = ["More acne solutions", "What causes acne?", "Skincare routine tips"];
    }
    // Foundation recommendations
    else if (input.includes('foundation')) {
      const foundations = this.products.filter(p =>
        p.productType === 'foundation' ||
        p.productCategory === 'liquid' ||
        p.description?.toLowerCase().includes('foundation')
      ).slice(0, 3);
      recommendedProducts = foundations;
      response = fallbackNotice + "I found some great foundation options for you! These provide excellent coverage:";
      quickActions = ["What's my shade?", "Powder vs liquid", "Application tips"];
    }
    // Ingredient questions
    else if (input.includes('ingredient') || input.includes('what is')) {
      response = fallbackNotice + "Key ingredients to know about:\n\n• **Hyaluronic Acid** - Hydrates and plumps skin\n• **Salicylic Acid** - Exfoliates and fights acne\n• **Niacinamide** - Reduces inflammation and redness\n• **Vitamin C** - Brightens and evensens skin tone\n• **Retinol** - Anti-aging and cell turnover\n\nWhich ingredient would you like to know more about?";
      quickActions = ["Tell me about retinol", "What about vitamin C?", "Ingredient safety"];
    }
    // Brand-specific
    else if (input.includes('colourpop') || input.includes('deciem') || input.includes('boosh')) {
      const brandName = input.includes('colourpop') ? 'ColourPop' :
                      input.includes('deciem') ? 'Deciem' : 'Boosh';
      const brandProducts = this.products.filter(p =>
        p.brand.toLowerCase().includes(brandName.toLowerCase())
      ).slice(0, 3);
      recommendedProducts = brandProducts;
      response = fallbackNotice + `Here are some popular ${brandName} products:`;
      quickActions = ["Show all brands", "Compare brands", "Brand loyalty program"];
    }
    // General help
    else {
      response = fallbackNotice + "I can help you with:\n\n• Finding products for your skin type\n• Comparing different products\n• Understanding ingredients\n• Budget recommendations\n• Brand preferences\n• Skincare concerns\n\nWhat would you like to know about?";
      quickActions = [
        "Find products for my skin type",
        "Compare products",
        "Tell me about ingredients",
        "Recommend budget-friendly options"
      ];
    }

    return {
      text: response,
      products: recommendedProducts,
      quickActions
    };
  }
}