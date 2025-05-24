import axios from 'axios';
import { OpenAILLMService } from '../../llmProviders/openai'; // Adjust path as necessary

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenAILLMService', () => {
  const apiKey = 'test-openai-api-key';
  let service: OpenAILLMService;

  beforeEach(() => {
    service = new OpenAILLMService(apiKey);
    mockedAxios.post.mockReset(); // Reset mock before each test
  });

  it('constructor should store the API key', () => {
    expect(service['apiKey']).toBe(apiKey); // Accessing private field for test
  });

  it('constructor should throw error if API key is not provided', () => {
    expect(() => new OpenAILLMService('')).toThrow('OpenAI API key is required for OpenAILLMService');
  });

  describe('extractProblemInfo', () => {
    const imageDataList = ['img1_base64', 'img2_base64'];
    const expectedUrl = 'https://api.openai.com/v1/chat/completions';

    it('should call axios.post with correct URL and payload structure', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { choices: [{ message: { function_call: { arguments: '{}' } } }] },
      });
      await service.extractProblemInfo(imageDataList);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({
          model: 'gpt-4o-mini',
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.arrayContaining([
                expect.objectContaining({ type: 'text' }),
                expect.objectContaining({ type: 'image_url', image_url: { url: expect.stringContaining('img1_base64') } }),
                expect.objectContaining({ type: 'image_url', image_url: { url: expect.stringContaining('img2_base64') } }),
              ]),
            }),
          ]),
          functions: expect.any(Array),
          function_call: expect.objectContaining({ name: 'extract_problem_details' }),
        }),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        })
      );
    });

    it('should return parsed function call arguments on successful response', async () => {
      const mockArgs = { problem_statement: 'Test problem' };
      mockedAxios.post.mockResolvedValueOnce({
        data: { choices: [{ message: { function_call: { arguments: JSON.stringify(mockArgs) } } }] },
      });
      const result = await service.extractProblemInfo(imageDataList);
      expect(result).toEqual(mockArgs);
    });

    it('should throw custom error on 429 response', async () => {
      mockedAxios.post.mockRejectedValueOnce({ response: { status: 429 } });
      await expect(service.extractProblemInfo(imageDataList)).rejects.toThrow(
        'API Key out of credits. Please refill your OpenAI API credits and try again.'
      );
    });
    
    it('should re-throw other errors', async () => {
      const genericError = new Error('Network issue');
      mockedAxios.post.mockRejectedValueOnce(genericError);
      await expect(service.extractProblemInfo(imageDataList)).rejects.toThrow('Network issue');
    });
  });

  describe('generateSolution', () => {
    const problemInfo = { problem_statement: 'Test problem' }; // Simplified ProblemInfo
    const expectedUrl = 'https://api.openai.com/v1/chat/completions';

    it('should call axios.post with correct URL and payload structure', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { choices: [{ message: { content: '{}' } }] },
      });
      await service.generateSolution(problemInfo);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({
          model: 'o1-mini',
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('Test problem'),
            }),
          ]),
        }),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        })
      );
    });

    it('should return parsed content on successful response', async () => {
      const mockSolution = { code: 'print("Hello")' };
      mockedAxios.post.mockResolvedValueOnce({
        data: { choices: [{ message: { content: JSON.stringify(mockSolution) } }] },
      });
      const result = await service.generateSolution(problemInfo);
      expect(result).toEqual(mockSolution);
    });
    
    it('should throw custom error on 429 response', async () => {
      mockedAxios.post.mockRejectedValueOnce({ response: { status: 429 } });
      await expect(service.generateSolution(problemInfo)).rejects.toThrow(
        'API Key out of credits. Please refill your OpenAI API credits and try again.'
      );
    });
  });

  describe('debugSolution', () => {
    const imageDataList = ['img1_base64'];
    const problemInfo = { problem_statement: 'Test debug problem' }; // Simplified
    const expectedUrl = 'https://api.openai.com/v1/chat/completions';

    it('should call axios.post with correct URL and payload structure', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { choices: [{ message: { function_call: { arguments: '{}' } } }] },
      });
      await service.debugSolution(imageDataList, problemInfo);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({
          model: 'gpt-4o',
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.arrayContaining([
                expect.objectContaining({ type: 'text', text: expect.stringContaining('Test debug problem') }),
                expect.objectContaining({ type: 'image_url' }),
              ]),
            }),
          ]),
          functions: expect.any(Array),
          function_call: expect.objectContaining({ name: 'provide_solution' }),
        }),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        })
      );
    });

    it('should return parsed function call arguments on successful response', async () => {
      const mockDebugResult = { new_code: 'fixed code' };
      mockedAxios.post.mockResolvedValueOnce({
        data: { choices: [{ message: { function_call: { arguments: JSON.stringify(mockDebugResult) } } }] },
      });
      const result = await service.debugSolution(imageDataList, problemInfo);
      expect(result).toEqual(mockDebugResult);
    });

    it('should throw custom error on 401 response', async () => {
      mockedAxios.post.mockRejectedValueOnce({ response: { status: 401 } });
      await expect(service.debugSolution(imageDataList, problemInfo)).rejects.toThrow(
        'Authentication failed. Please check your API key.'
      );
    });
    
    it('should throw custom error on 429 response', async () => {
      mockedAxios.post.mockRejectedValueOnce({ response: { status: 429 } });
      await expect(service.debugSolution(imageDataList, problemInfo)).rejects.toThrow(
        'API Key out of credits. Please refill your OpenAI API credits and try again.'
      );
    });
    
    it('should throw custom error on 404 response', async () => {
      mockedAxios.post.mockRejectedValueOnce({ response: { status: 404 } });
      await expect(service.debugSolution(imageDataList, problemInfo)).rejects.toThrow(
        'API endpoint not found. Please check the model name and URL.'
      );
    });
  });
});
