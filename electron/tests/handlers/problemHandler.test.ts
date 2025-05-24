import { OpenAILLMService } from '../../llmProviders/openai';
import { LocalLLMService } from '../../llmProviders/localLlm';
import { GitHubMarketplaceLLMService } from '../../llmProviders/githubMarketplaceLlm';
import { getLLMService } from '../../handlers/problemHandler'; // Use named import


// Mock electron-store
// We need to mock the global 'store' instance used by problemHandler.ts
jest.mock('../../store', () => {
  const mockStoreData: Record<string, string | null> = {};
  return {
    store: {
      get: jest.fn((key: string) => mockStoreData[key] || null),
      // set: jest.fn((key: string, value: any) => { mockStoreData[key] = value; }), // If we need to set values
      // clear: jest.fn(() => { Object.keys(mockStoreData).forEach(key => delete mockStoreData[key]); }), // If we need to clear
      // For this test, we'll manually set mockStoreData before each test group
      __mockStoreData: mockStoreData, // Expose for test setup
    },
  };
});

// Import the mocked store to set its data
const { store } = require('../../store');

describe('getLLMService in problemHandler', () => {
  const originalStoreData = { ...store.__mockStoreData };

  beforeEach(() => {
    // Reset store mock data before each test
    for (const key in store.__mockStoreData) {
      delete store.__mockStoreData[key];
    }
    // Restore original data if any, or set to a known state
    Object.assign(store.__mockStoreData, {}); 
  });

  afterAll(() => {
    // Restore original store data after all tests
     for (const key in store.__mockStoreData) {
      delete store.__mockStoreData[key];
    }
    Object.assign(store.__mockStoreData, originalStoreData);
  });

  it('should return OpenAILLMService when preferredProvider is "openai" and key is present', () => {
    store.__mockStoreData['preferredProvider'] = 'openai';
    store.__mockStoreData['openaiApiKey'] = 'test-openai-key';
    const service = getLLMService();
    expect(service).toBeInstanceOf(OpenAILLMService);
  });

  it('should return LocalLLMService when preferredProvider is "local" and baseUrl is present', () => {
    store.__mockStoreData['preferredProvider'] = 'local';
    store.__mockStoreData['localLLMBaseUrl'] = 'http://localhost:11434';
    const service = getLLMService();
    expect(service).toBeInstanceOf(LocalLLMService);
  });
  
  it('should return LocalLLMService with apiKey if localLLMApiKey is also present', () => {
    store.__mockStoreData['preferredProvider'] = 'local';
    store.__mockStoreData['localLLMBaseUrl'] = 'http://localhost:8080';
    store.__mockStoreData['localLLMApiKey'] = 'test-local-key';
    const service = getLLMService();
    expect(service).toBeInstanceOf(LocalLLMService);
    // You might want to check if the key was passed, but this requires exposing it or specific mock behavior
  });

  it('should return GitHubMarketplaceLLMService when preferredProvider is "github_marketplace" and key is present', () => {
    store.__mockStoreData['preferredProvider'] = 'github_marketplace';
    store.__mockStoreData['githubMarketplaceLLMApiKey'] = 'test-gh-key';
    const service = getLLMService();
    expect(service).toBeInstanceOf(GitHubMarketplaceLLMService);
  });
  
  it('should return GitHubMarketplaceLLMService with modelId if githubMarketplaceLLMModelId is also present', () => {
    store.__mockStoreData['preferredProvider'] = 'github_marketplace';
    store.__mockStoreData['githubMarketplaceLLMApiKey'] = 'test-gh-key';
    store.__mockStoreData['githubMarketplaceLLMModelId'] = 'test-model-id';
    const service = getLLMService();
    expect(service).toBeInstanceOf(GitHubMarketplaceLLMService);
  });

  it('should throw error if preferredProvider is not set', () => {
    // preferredProvider is null by default due to beforeEach
    expect(() => getLLMService()).toThrow('Preferred provider "null" is not configured or supported');
  });
  
  it('should throw error if preferredProvider is set to an unsupported value', () => {
    store.__mockStoreData['preferredProvider'] = 'unsupported_provider';
    expect(() => getLLMService()).toThrow('Preferred provider "unsupported_provider" is not configured or supported');
  });

  it('should throw error if preferredProvider is "openai" but openaiApiKey is missing', () => {
    store.__mockStoreData['preferredProvider'] = 'openai';
    // openaiApiKey is not set
    expect(() => getLLMService()).toThrow('OpenAI API key is missing for preferred provider OpenAI.');
  });
  
  it('should throw error if preferredProvider is "local" but localLLMBaseUrl is missing', () => {
    store.__mockStoreData['preferredProvider'] = 'local';
    expect(() => getLLMService()).toThrow('Local LLM base URL is missing for preferred provider Local LLM.');
  });

  it('should throw error if preferredProvider is "github_marketplace" but githubMarketplaceLLMApiKey is missing', () => {
    store.__mockStoreData['preferredProvider'] = 'github_marketplace';
    expect(() => getLLMService()).toThrow('GitHub Marketplace LLM API key is missing for preferred provider GitHub Marketplace.');
  });

  // Tests for Gemini and Claude (currently expected to throw "not yet implemented")
  it('should throw "not yet implemented" for "gemini" provider', () => {
    store.__mockStoreData['preferredProvider'] = 'gemini';
    store.__mockStoreData['geminiApiKey'] = 'test-gemini-key'; // Key is present
    expect(() => getLLMService()).toThrow('Gemini LLM service not yet implemented.');
  });

  it('should throw "not yet implemented" for "claude" provider', () => {
    store.__mockStoreData['preferredProvider'] = 'claude';
    store.__mockStoreData['claudeApiKey'] = 'test-claude-key'; // Key is present
    expect(() => getLLMService()).toThrow('Claude LLM service not yet implemented.');
  });
});

// describe('Handler functions (handleExtractProblemInfo, handleGenerateSolution, handleDebugSolution)', () => {
//   // These tests would be more involved, requiring mocking getLLMService itself
//   // or ensuring getLLMService returns a mock LLMService implementation.
//   // For now, focusing on getLLMService.
//   it.todo('handleExtractProblemInfo calls llmService.extractProblemInfo');
//   it.todo('handleGenerateSolution calls llmService.generateSolution');
//   it.todo('handleDebugSolution calls llmService.debugSolution');
// });
