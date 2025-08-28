# 🎭 MaskWatch: Real-Time AI Face Mask Detection

<div align="center">
  <img src="https://picsum.photos/800/400?random=1" alt="MaskWatch Application Banner" data-ai-hint="application banner" style="border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1);">
</div>

**MaskWatch is a modern, AI-powered web application that uses your device's camera to detect in real-time whether individuals are wearing face masks.**

Built with a cutting-edge tech stack, this application provides instant visual feedback, making it an effective tool for ensuring safety compliance in various environments. It features a sleek, responsive interface and powerful AI capabilities to deliver accurate and fast results.

---

## ✨ Key Features

- **🚀 Real-Time Detection**: Analyzes the live camera feed to instantly identify faces and determine if a mask is being worn.
- **🧠 AI-Powered Accuracy**: Leverages **Google's Gemini model** via **Genkit** to provide highly accurate detection results.
- **🖼️ Visual Bounding Boxes**: Overlays colored boxes on the video feed for clear, immediate feedback:
  - **<span style="color: #22c55e;">■</span> Green Box**: Indicates a mask is correctly worn.
  - **<span style="color: #ef4444;">■</span> Red Box**: Indicates no mask is detected.
- **📸 Automatic Snapshots**: Automatically captures and saves a snapshot when a person without a mask is detected, creating a visual log for review.
- **📂 Upload for Analysis**: Don't want to use a live feed? You can upload an image, and the AI will analyze it for mask presence.
- **⚙️ Customizable Settings**: Easily switch between available cameras and adjust detection sensitivity through an intuitive settings panel.
- **🎨 Modern & Responsive UI**: A polished and user-friendly interface built with **ShadCN UI** and **Tailwind CSS** that looks great on any device.

---

## 🛠️ Tech Stack

This project is built with a modern, robust, and scalable technology stack:

- **Framework**: [**Next.js**](https://nextjs.org/) (with App Router)
- **Language**: [**TypeScript**](https://www.typescriptlang.org/)
- **AI Integration**: [**Google Gemini & Genkit**](https://firebase.google.com/docs/genkit)
- **UI Components**: [**ShadCN UI**](https://ui.shadcn.com/)
- **Styling**: [**Tailwind CSS**](https://tailwindcss.com/)
- **State Management**: React Hooks & Context API

---

## 🚀 Getting Started

To get this project up and running on your local machine, follow these simple steps.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (version 18 or later) and npm installed.

### Installation & Running the App

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`. Open it in your browser, grant camera permissions, and start detecting!

---

## ✍️ Author

This project was created by:

- **[Nikhil](https://www.linkedin.com/in/nikhil-verma-9a6760138/)**

Feel free to connect and share your thoughts!
