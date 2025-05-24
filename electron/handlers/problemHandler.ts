import { store } from "../store";
import { LLMService } from "../llmService/llmServiceInterface";
import { OpenAILLMService } from "../llmProviders/openai";
import { LocalLLMService } from "../llmProviders/localLlm";
import { GitHubMarketplaceLLMService } from "../llmProviders/githubMarketplaceLlm";
// Import other LLM services like GeminiLLMService, ClaudeLLMService here when they are created

// Define types for parameters if they are structured and known, otherwise use 'any'.
// For now, we assume problemInfo might be a structured object.
// If ProblemInfo and DebugSolutionResponse are needed from openai.ts, they would be imported:
// import { ProblemInfo, DebugSolutionResponse } from "../llmProviders/openai";
// However, the LLMService interface uses `any` for these, so handlers can also use `any`.

// Export for testing purposes
export function getLLMService(): LLMService {
  const preferredProvider = store.get("preferredProvider");
  let apiKey: string | null | undefined = null; // Can be undefined for local LLM if not set
  let baseUrl: string | null = null;
  let modelId: string | null | undefined = null;


  switch (preferredProvider) {
    case "openai":
      apiKey = store.get("openaiApiKey");
      if (!apiKey) {
        throw new Error("OpenAI API key is missing for preferred provider OpenAI.");
      }
      return new OpenAILLMService(apiKey);
    case "gemini":
      apiKey = store.get("geminiApiKey");
      if (!apiKey) {
        // throw new Error("Gemini API key is missing for preferred provider Gemini.");
      }
      // return new GeminiLLMService(apiKey); // To be implemented
      throw new Error("Gemini LLM service not yet implemented.");
    case "claude":
      apiKey = store.get("claudeApiKey");
      if (!apiKey) {
        // throw new Error("Claude API key is missing for preferred provider Claude.");
      }
      // return new ClaudeLLMService(apiKey); // To be implemented
      throw new Error("Claude LLM service not yet implemented.");
    case "local":
      baseUrl = store.get("localLLMBaseUrl");
      apiKey = store.get("localLLMApiKey"); // Optional
      if (!baseUrl) {
        throw new Error("Local LLM base URL is missing for preferred provider Local LLM.");
      }
      return new LocalLLMService(baseUrl, apiKey || undefined); // Pass undefined if null
    case "github_marketplace":
      apiKey = store.get("githubMarketplaceLLMApiKey");
      modelId = store.get("githubMarketplaceLLMModelId"); // Optional
      if (!apiKey) {
        throw new Error("GitHub Marketplace LLM API key is missing for preferred provider GitHub Marketplace.");
      }
      return new GitHubMarketplaceLLMService(apiKey, modelId || undefined); // Pass undefined if null
    default:
      // Fallback or default behavior: try OpenAI if no preference is set but key is available
      // Or, strictly require a preferred provider to be set.
      // For now, strict:
      const availableKeys = {
        openai: store.get("openaiApiKey"),
        gemini: store.get("geminiApiKey"),
        claude: store.get("claudeApiKey"),
        local: store.get("localLLMBaseUrl"),
        github_marketplace: store.get("githubMarketplaceLLMApiKey"),
      };
      const configuredProvider = Object.entries(availableKeys).find(([key, value]) => value);

      if (configuredProvider) {
         throw new Error(
          `Preferred provider "${preferredProvider}" is not configured or supported. ` +
          `However, provider "${configuredProvider[0]}" has an API key/URL set. Please select it as preferred or configure "${preferredProvider}".`
        );
      } else {
        throw new Error(
          `Preferred provider "${preferredProvider}" is not configured or supported, or its API key/URL is missing. No other providers seem to be configured either.`
        );
      }
  }
}

export async function handleExtractProblemInfo(
  imageDataList: string[]
): Promise<any> {
  const llmService = getLLMService();
  return llmService.extractProblemInfo(imageDataList);
}

export async function handleGenerateSolution(problemInfo: any): Promise<any> {
  const llmService = getLLMService();
  return llmService.generateSolution(problemInfo);
}

export async function handleDebugSolution(
  imageDataList: string[],
  problemInfo: any
): Promise<any> {
  const llmService = getLLMService();
  return llmService.debugSolution(imageDataList, problemInfo);
}
