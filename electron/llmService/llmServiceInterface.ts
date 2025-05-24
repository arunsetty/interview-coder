export interface LLMService {
  extractProblemInfo(imageDataList: string[]): Promise<any>;
  generateSolution(problemInfo: any): Promise<any>;
  debugSolution(imageDataList: string[], problemInfo: any): Promise<any>;
}
