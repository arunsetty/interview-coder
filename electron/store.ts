import Store from "electron-store"

interface StoreSchema {
  openaiApiKey: string | null
  geminiApiKey: string | null
  claudeApiKey: string | null
  localLLMBaseUrl: string | null
  localLLMApiKey: string | null
  githubMarketplaceLLMApiKey: string | null
  githubMarketplaceLLMModelId: string | null
  preferredProvider: 'openai' | 'gemini' | 'claude' | 'local' | 'github_marketplace' | null
}

export const store = new Store<StoreSchema>({
  defaults: {
    openaiApiKey: null,
    geminiApiKey: null,
    claudeApiKey: null,
    localLLMBaseUrl: null,
    localLLMApiKey: null,
    githubMarketplaceLLMApiKey: null,
    githubMarketplaceLLMModelId: null,
    preferredProvider: 'openai'
  },
  // Encrypt the API key in storage
  encryptionKey: "your-encryption-key" // This will encrypt all fields
})
