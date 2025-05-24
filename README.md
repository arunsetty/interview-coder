# Interview Coder

An invisible desktop application that will help you pass your technical interviews.


https://github.com/user-attachments/assets/caf1e6cd-27d5-4033-b8c5-9df1cb52b21d


## Invisibility Compatibility

The application is invisible to:

- Zoom versions below 6.1.6 (inclusive)
- All browser-based screen recording software
- All versions of Discord
- Mac OS screenshot functionality (Command + Shift + 3/4)

Note: The application is **NOT** invisible to:

- Zoom versions 6.1.6 and above
- Mac OS native screen recording (Command + Shift + 5)

## Features

- 🎯 99% Invisibility: Undetectable window that bypasses most screen capture methods
- 📸 Smart Screenshot Capture: Capture both question text and code separately for better analysis
- 🤖 AI-Powered Analysis: Automatically extracts and analyzes coding problems
- 💡 Solution Generation: Get detailed explanations and solutions
- 🔧 Real-time Debugging: Debug your code with AI assistance
- 🎨 Window Management: Freely move and position the window anywhere on screen

## Global Commands

The application uses unidentifiable global keyboard shortcuts that won't be detected by browsers or other applications:

- Toggle Window Visibility: [Control or Cmd + b]
- Move Window: [Control or Cmd + arrows]
- Take Screenshot: [Control or Cmd + H]
- Process Screenshots: [Control or Cmd + Enter]
- Reset View: [Control or Cmd + R]

## Usage

1. **Initial Setup**

   - Launch the invisible window
   - Authenticate with OpenAI API key

2. **Capturing Problem**

   - Use global shortcut to take screenshots
   - Capture question text and code separately for better analysis
   - Screenshots are automatically added to the processing queue

3. **Processing**

   - AI analyzes the screenshots to extract:
     - Problem requirements
     - Code context
   - System generates optimal solution strategy

4. **Solution & Debugging**

   - View generated solutions
   - Use debugging feature to:
     - Test different approaches
     - Fix errors in your code
     - Get line-by-line explanations
   - Toggle between solutions and queue views

5. **Window Management**
   - Move window freely using global shortcut
   - Toggle visibility as needed
   - Window remains invisible to specified applications
   - Reset view using Command + R

## Prerequisites

- Node.js (v16 or higher)
- npm or bun package manager
- OpenAI API key (for AI features)
- Screen Recording Permission for Terminal/IDE
  - On macOS:
    1. Go to System Preferences > Security & Privacy > Privacy > Screen Recording
    2. Ensure your Terminal app (or IDE) has screen recording permission enabled
    3. Restart your Terminal/IDE after enabling permissions
  - On Windows:
    - No additional permissions needed
  - On Linux:
    - May require `xhost` access depending on your distribution

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ibttf/interview-coder.git
cd interview-coder
```

2. Install dependencies:

```bash
npm install
# or if using bun
bun install
```

## Running Locally

1. Start the development server:

```bash
npm run app:dev
# or
bun run app:dev
```

This will:

- Start the Vite development server
- Launch the Electron application
- Enable hot-reloading for development

## Building for Production

To create a production build:

```bash
npm run app:build
# or
bun run app:build
```

The built application will be available in the `release` directory.

## Tech Stack

- Electron
- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- OpenAI API

## Supported LLM Providers

Interview Coder supports multiple LLM providers. You can configure and select your preferred provider in the application's settings upon first launch, or by resetting the application (Cmd/Ctrl + R and re-authenticating).

Here are the currently supported and planned providers:

*   **OpenAI**:
    *   Requires an OpenAI API key.
    *   Enter your `sk-...` API key when prompted.

*   **Local LLMs**:
    *   Allows you to connect to a locally running LLM instance (e.g., Ollama, llamafile, Jan.ai, LM Studio).
    *   **Base URL**: Required. This is the URL of your local LLM server (e.g., `http://localhost:11434` for Ollama, `http://localhost:8080` for llamafile).
    *   **API Key**: Optional. Some local LLM servers might require an API key; enter it if your setup needs one.

*   **GitHub Marketplace LLMs**: (Placeholder - Functionality not yet implemented)
    *   Allows you to use LLM models provisioned through the GitHub Marketplace.
    *   **API Key**: Required. You'll need an API key for the specific GitHub Marketplace LLM service.
    *   **Model ID**: Optional. Depending on the service, you might need to specify a model ID.

*   **Gemini**: (Planned - Functionality not yet implemented)
    *   Will require a Google AI Studio (Gemini) API key.

*   **Claude**: (Planned - Functionality not yet implemented)
    *   Will require an Anthropic Claude API key.

To select your preferred provider:
1.  Launch the application. If it's your first time, you'll be taken to the settings screen.
2.  If you've already configured the app, you can reset and re-configure by pressing `Cmd + R` (or `Ctrl + R` on Windows/Linux) and then `Cmd + B` (or `Ctrl + B`) to show the window. This will bring you back to the API key/provider selection screen.
3.  Use the "Preferred LLM Provider" dropdown to select your desired LLM.
4.  Fill in the required fields for the selected provider (API Key, Base URL, etc.). Only the fields relevant to your selected provider need to be filled.
5.  Click "Save and Continue".

## Configuration

1. On first launch, you'll be prompted to configure your preferred LLM provider and enter any necessary API keys or URLs (see "Supported LLM Providers" section for details).
2. The application will store your settings locally and securely using `electron-store`.
3. To change your configuration, you can reset the application by pressing `Cmd + R` (or `Ctrl + R`) and then `Cmd + B` (or `Ctrl + B`) to re-display the settings screen.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License
