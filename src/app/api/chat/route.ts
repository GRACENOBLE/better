import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const generateRoadmapTool = tool({
  description:
    "Generate a structured learning roadmap with nodes and edges for any topic, skill, or goal. Use this when users ask for roadmaps, learning paths, step-by-step guides, or career development plans.",
  parameters: z.object({
    topic: z.string().describe("The main topic or goal for the roadmap"),
    timeframe: z
      .string()
      .optional()
      .describe("Optional timeframe for completing the roadmap"),
    difficulty: z
      .enum(["beginner", "intermediate", "advanced"])
      .optional()
      .describe("Target difficulty level"),
    focus: z
      .string()
      .optional()
      .describe("Specific focus area or specialization within the topic"),
  }),
  execute: async ({ topic, timeframe, difficulty, focus }) => {
    console.log(`Generating roadmap for: ${topic}`);
    const roadmapData = generateRoadmapStructure(
      topic,
      timeframe,
      difficulty,
      focus
    );
    return roadmapData;
  },
});

function generateRoadmapStructure(
  topic: string,
  timeframe?: string,
  difficulty?: string,
  focus?: string
) {
  const topicLower = topic.toLowerCase();

  // React/Frontend Development Roadmap
  if (topicLower.includes("react") || topicLower.includes("frontend")) {
    return {
      nodes: [
        {
          id: "1",
          label: "HTML & CSS Basics",
          level: 0,
          description: "Master HTML structure and CSS styling fundamentals",
        },
        {
          id: "2",
          label: "JavaScript Fundamentals",
          level: 0,
          description: "Learn ES6+, DOM manipulation, and async programming",
        },
        {
          id: "3",
          label: "React Basics",
          level: 1,
          description: "Components, JSX, props, and basic state management",
        },
        {
          id: "4",
          label: "React Hooks",
          level: 2,
          description: "useState, useEffect, useContext, and custom hooks",
        },
        {
          id: "5",
          label: "State Management",
          level: 2,
          description: "Redux, Zustand, or Context API for complex state",
        },
        {
          id: "6",
          label: "React Router",
          level: 2,
          description: "Client-side routing and navigation",
        },
        {
          id: "7",
          label: "Testing",
          level: 3,
          description: "Jest, React Testing Library, and component testing",
        },
        {
          id: "8",
          label: "Next.js",
          level: 3,
          description: "Full-stack React framework with SSR/SSG",
        },
        {
          id: "9",
          label: "Build Projects",
          level: 4,
          description: "Create portfolio projects and real applications",
        },
      ],
      edges: [
        { id: "e1-3", source: "1", target: "3", label: "Learn" },
        { id: "e2-3", source: "2", target: "3", label: "Apply" },
        { id: "e3-4", source: "3", target: "4", label: "Advanced" },
        { id: "e4-5", source: "4", target: "5", label: "Scale" },
        { id: "e4-6", source: "4", target: "6", label: "Navigate" },
        { id: "e5-7", source: "5", target: "7", label: "Test" },
        { id: "e6-8", source: "6", target: "8", label: "Framework" },
        { id: "e7-9", source: "7", target: "9", label: "Build" },
        { id: "e8-9", source: "8", target: "9", label: "Create" },
      ],
      metadata: { topic, timeframe, difficulty, focus },
    };
  }

  // Data Science Roadmap
  if (
    topicLower.includes("data science") ||
    topicLower.includes("machine learning")
  ) {
    return {
      nodes: [
        {
          id: "1",
          label: "Python Basics",
          level: 0,
          description:
            "Learn Python syntax, data types, and control structures",
        },
        {
          id: "2",
          label: "Statistics & Math",
          level: 0,
          description: "Probability, statistics, linear algebra basics",
        },
        {
          id: "3",
          label: "Pandas & NumPy",
          level: 1,
          description: "Data manipulation and numerical computing",
        },
        {
          id: "4",
          label: "Data Visualization",
          level: 1,
          description: "Matplotlib, Seaborn, and Plotly for charts",
        },
        {
          id: "5",
          label: "Machine Learning",
          level: 2,
          description: "Scikit-learn, supervised and unsupervised learning",
        },
        {
          id: "6",
          label: "Deep Learning",
          level: 3,
          description: "TensorFlow/PyTorch and neural networks",
        },
        {
          id: "7",
          label: "SQL & Databases",
          level: 1,
          description: "Database querying and data extraction",
        },
        {
          id: "8",
          label: "Real Projects",
          level: 4,
          description: "End-to-end data science projects",
        },
      ],
      edges: [
        { id: "e1-3", source: "1", target: "3", label: "Apply" },
        { id: "e2-5", source: "2", target: "5", label: "Foundation" },
        { id: "e3-4", source: "3", target: "4", label: "Visualize" },
        { id: "e3-5", source: "3", target: "5", label: "Model" },
        { id: "e4-8", source: "4", target: "8", label: "Present" },
        { id: "e5-6", source: "5", target: "6", label: "Advanced" },
        { id: "e7-8", source: "7", target: "8", label: "Data" },
        { id: "e6-8", source: "6", target: "8", label: "Deploy" },
      ],
      metadata: { topic, timeframe, difficulty, focus },
    };
  }

  // Startup Roadmap
  if (topicLower.includes("startup") || topicLower.includes("business")) {
    return {
      nodes: [
        {
          id: "1",
          label: "Idea Validation",
          level: 0,
          description: "Research market need and validate your concept",
        },
        {
          id: "2",
          label: "Market Research",
          level: 0,
          description: "Analyze competitors and target audience",
        },
        {
          id: "3",
          label: "MVP Development",
          level: 1,
          description: "Build minimum viable product",
        },
        {
          id: "4",
          label: "Business Plan",
          level: 1,
          description: "Create comprehensive business strategy",
        },
        {
          id: "5",
          label: "Funding Strategy",
          level: 2,
          description: "Seek investors, grants, or bootstrapping",
        },
        {
          id: "6",
          label: "Launch & Marketing",
          level: 2,
          description: "Go to market and acquire customers",
        },
        {
          id: "7",
          label: "Scale Operations",
          level: 3,
          description: "Optimize processes and grow team",
        },
        {
          id: "8",
          label: "Growth & Expansion",
          level: 4,
          description: "Scale business and explore new markets",
        },
      ],
      edges: [
        { id: "e1-3", source: "1", target: "3", label: "Build" },
        { id: "e2-4", source: "2", target: "4", label: "Plan" },
        { id: "e3-6", source: "3", target: "6", label: "Launch" },
        { id: "e4-5", source: "4", target: "5", label: "Fund" },
        { id: "e5-7", source: "5", target: "7", label: "Grow" },
        { id: "e6-7", source: "6", target: "7", label: "Scale" },
        { id: "e7-8", source: "7", target: "8", label: "Expand" },
      ],
      metadata: { topic, timeframe, difficulty, focus },
    };
  }

  // Generic roadmap for any other topic
  return {
    nodes: [
      {
        id: "1",
        label: "Getting Started",
        level: 0,
        description: `Begin your ${topic} journey with basics`,
      },
      {
        id: "2",
        label: "Learn Fundamentals",
        level: 1,
        description: "Master the core concepts and principles",
      },
      {
        id: "3",
        label: "Practice & Apply",
        level: 2,
        description: "Hands-on practice with real examples",
      },
      {
        id: "4",
        label: "Intermediate Skills",
        level: 2,
        description: "Build upon the foundation",
      },
      {
        id: "5",
        label: "Advanced Topics",
        level: 3,
        description: "Explore complex concepts and techniques",
      },
      {
        id: "6",
        label: "Real Projects",
        level: 3,
        description: "Apply knowledge to practical projects",
      },
      {
        id: "7",
        label: "Specialization",
        level: 4,
        description: "Choose your area of expertise",
      },
      {
        id: "8",
        label: "Mastery",
        level: 4,
        description: `Become an expert in ${topic}`,
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", label: "Learn" },
      { id: "e2-3", source: "2", target: "3", label: "Practice" },
      { id: "e2-4", source: "2", target: "4", label: "Advance" },
      { id: "e3-6", source: "3", target: "6", label: "Apply" },
      { id: "e4-5", source: "4", target: "5", label: "Deepen" },
      { id: "e5-7", source: "5", target: "7", label: "Specialize" },
      { id: "e6-8", source: "6", target: "8", label: "Master" },
      { id: "e7-8", source: "7", target: "8", label: "Expert" },
    ],
    metadata: { topic, timeframe, difficulty, focus },
  };
}

export async function POST(req: Request) {
  try {
    console.log("=== CHAT API CALLED ===");
    const { messages } = await req.json();

    const result = streamText({
      model: google("models/gemini-2.0-flash-exp"),
      system: `You are an expert learning advisor and roadmap creator. You help people create structured learning paths for any topic or goal.

When users ask for roadmaps, learning paths, career guidance, or step-by-step plans, use the generateRoadmap tool to create visual roadmaps.

You can help with:
- Programming and technology learning paths (React, Python, JavaScript, etc.)
- Career development roadmaps (Data Science, Software Engineering, etc.)
- Business and startup planning
- Academic subject mastery
- Skill development journeys
- Project planning roadmaps

Always be encouraging and explain why each step in the roadmap is important. Provide context about the learning journey and offer additional tips when helpful.

For general questions not related to roadmaps, respond normally as a helpful assistant.`,
      messages,
      tools: {
        generateRoadmap: generateRoadmapTool,
      },
      maxSteps: 3,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
