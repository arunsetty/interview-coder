import { useState, useRef, useEffect } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select" // Assuming this path is correct
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card"

interface ApiKeyAuthProps {
  // onApiKeySubmit is no longer needed as we'll call an IPC handler directly
}

const ApiKeyAuth: React.FC<ApiKeyAuthProps> = (/*{ onApiKeySubmit }*/) => {
  const [openaiApiKey, setOpenaiApiKey] = useState("")
  const [geminiApiKey, setGeminiApiKey] = useState("")
  const [claudeApiKey, setClaudeApiKey] = useState("")
  const [localLLMBaseUrl, setLocalLLMBaseUrl] = useState("")
  const [localLLMApiKey, setLocalLLMApiKey] = useState("")
  const [githubMarketplaceLLMApiKey, setGithubMarketplaceLLMApiKey] = useState("")
  const [githubMarketplaceLLMModelId, setGithubMarketplaceLLMModelId] = useState("")
  const [preferredProvider, setPreferredProvider] = useState<
    "openai" | "gemini" | "claude" | "local" | "github_marketplace"
  >("openai")
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // Height update logic
    const updateDimensions = () => {
      if (contentRef.current) {
        let contentHeight = contentRef.current.scrollHeight
        const contentWidth = contentRef.current.scrollWidth
        window.electronAPI.updateContentDimensions({
          width: contentWidth,
          height: contentHeight
        })
      }
    }

    // Initialize resize observer
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }
    updateDimensions()

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Call the new IPC handler
    window.electronAPI.setApiKeysAndProvider({
      openaiApiKey: openaiApiKey.trim(),
      geminiApiKey: geminiApiKey.trim(),
      claudeApiKey: claudeApiKey.trim(),
      localLLMBaseUrl: localLLMBaseUrl.trim(),
      localLLMApiKey: localLLMApiKey.trim(),
      githubMarketplaceLLMApiKey: githubMarketplaceLLMApiKey.trim(),
      githubMarketplaceLLMModelId: githubMarketplaceLLMModelId.trim(),
      preferredProvider
    })
  }

  const handleOpenLink = (url: string) => {
    window.electronAPI.openExternal(url)
  }

  return (
    <div
      ref={contentRef}
      className="w-fit h-fit flex flex-col items-center justify-center bg-gray-50 rounded-xl"
    >
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-center">
            Welcome to Interview Coder
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your API keys below. Only the key for the preferred provider
            is required. Your keys will be stored securely. Press Cmd + B to
            hide/show the window.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4"> {/* Adjusted spacing */}
            <div className="space-y-2">
              <label htmlFor="preferredProvider" className="text-sm font-medium">Preferred LLM Provider</label>
              <Select
                value={preferredProvider}
                onValueChange={(
                  value: "openai" | "gemini" | "claude" | "local" | "github_marketplace"
                ) => setPreferredProvider(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="gemini">Gemini (Not Implemented)</SelectItem>
                  <SelectItem value="claude">Claude (Not Implemented)</SelectItem>
                  <SelectItem value="local">Local LLM</SelectItem>
                  <SelectItem value="github_marketplace">GitHub Marketplace LLM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {preferredProvider === "openai" && (
            <div className="space-y-2">
              <label htmlFor="openaiApiKey" className="text-sm font-medium">OpenAI API Key</label>
              <Input
                id="openaiApiKey"
                type="password"
                placeholder="sk-..."
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                className="w-full"
              />
            </div>
            )}

            {preferredProvider === "gemini" && (
            <div className="space-y-2">
              <label htmlFor="geminiApiKey" className="text-sm font-medium">Gemini API Key</label>
              <Input
                id="geminiApiKey"
                type="password"
                placeholder="Gemini API Key (Not Implemented)"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full"
              />
            </div>
            )}

            {preferredProvider === "claude" && (
            <div className="space-y-2">
              <label htmlFor="claudeApiKey" className="text-sm font-medium">Claude API Key</label>
              <Input
                id="claudeApiKey"
                type="password"
                placeholder="Claude API Key (Not Implemented)"
                value={claudeApiKey}
                onChange={(e) => setClaudeApiKey(e.target.value)}
                className="w-full"
              />
            </div>
            )}

            {preferredProvider === "local" && (
              <>
                <div className="space-y-2">
                  <label htmlFor="localLLMBaseUrl" className="text-sm font-medium">Local LLM Base URL</label>
                  <Input
                    id="localLLMBaseUrl"
                    type="text"
                    placeholder="e.g., http://localhost:11434"
                    value={localLLMBaseUrl}
                    onChange={(e) => setLocalLLMBaseUrl(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="localLLMApiKey" className="text-sm font-medium">Local LLM API Key (Optional)</label>
                  <Input
                    id="localLLMApiKey"
                    type="password"
                    placeholder="Optional API Key"
                    value={localLLMApiKey}
                    onChange={(e) => setLocalLLMApiKey(e.target.value)}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {preferredProvider === "github_marketplace" && (
              <>
                <div className="space-y-2">
                  <label htmlFor="githubMarketplaceLLMApiKey" className="text-sm font-medium">GitHub Marketplace LLM API Key</label>
                  <Input
                    id="githubMarketplaceLLMApiKey"
                    type="password"
                    placeholder="GitHub Marketplace API Key"
                    value={githubMarketplaceLLMApiKey}
                    onChange={(e) => setGithubMarketplaceLLMApiKey(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="githubMarketplaceLLMModelId" className="text-sm font-medium">Model ID (Optional)</label>
                  <Input
                    id="githubMarketplaceLLMModelId"
                    type="text"
                    placeholder="Optional Model ID"
                    value={githubMarketplaceLLMModelId}
                    onChange={(e) => setGithubMarketplaceLLMModelId(e.target.value)}
                    className="w-full"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full font-medium"
              disabled={
                (preferredProvider === "openai" && !openaiApiKey.trim()) ||
                (preferredProvider === "gemini" && !geminiApiKey.trim()) || // Will be true due to Not Implemented
                (preferredProvider === "claude" && !claudeApiKey.trim()) || // Will be true due to Not Implemented
                (preferredProvider === "local" && !localLLMBaseUrl.trim()) ||
                (preferredProvider === "github_marketplace" && !githubMarketplaceLLMApiKey.trim())
              }
            >
              Save and Continue
            </Button>
            <p className="text-gray-400 text-xs text-center pt-2">
              built out of frustration by{" "}
              <button
                onClick={() =>
                  handleOpenLink("https://www.linkedin.com/in/roy-lee-cs123")
                }
                className="text-gray-400 hover:text-gray-600 underline"
              >
                Roy
              </button>{" "}
              n'{" "}
              <button
                onClick={() =>
                  handleOpenLink("https://www.linkedin.com/in/neel-shanmugam/")
                }
                className="text-gray-400 hover:text-gray-600 underline"
              >
                Neel
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApiKeyAuth
