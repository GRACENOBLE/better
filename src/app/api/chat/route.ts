import { google } from "@ai-sdk/google";
import { streamText, tool, generateObject } from "ai";
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
    console.log(`Generating AI roadmap for: ${topic}`);

    const roadmapData = await generateAIRoadmap(
      topic,
      timeframe,
      difficulty,
      focus
    );
    return roadmapData;
  },
});

async function generateAIRoadmap(
  topic: string,
  timeframe?: string,
  difficulty?: string,
  focus?: string
) {
  try {
    const prompt = `Create a comprehensive learning roadmap for "${topic}".

CRITICAL REQUIREMENTS FOR NODES:
1. Create 3-4 main milestone nodes (type: "main") that represent the major phases of learning
2. For each main milestone, create 2-4 topic nodes (type: "topic") that represent key areas to learn
3. For each topic, create 3-5 subtopic nodes (type: "subtopic") that represent specific skills/tools/concepts
4. Assign appropriate levels (0, 1, 2, 3) to organize the progression
5. Use kebab-case for all node IDs (e.g., "basic-controls", "weapon-handling")

CRITICAL REQUIREMENTS FOR EDGES - YOU MUST CREATE ALL OF THESE:
1. Main flow edges: Connect each main node to the next main node (type: "main")
2. Main-to-topic edges: Connect each main node to its related topic nodes (type: "dotted")
3. Topic-to-subtopic edges: Connect EVERY topic node to ALL of its subtopic children (type: "dotted")

EDGE GENERATION RULES:
- EVERY subtopic node MUST have exactly one incoming edge from a topic node
- EVERY topic node MUST have at least one incoming edge from a main node
- NO subtopic node should be left disconnected
- Create edge IDs like "e-source-target" (e.g., "e-basics-fundamentals", "e-fundamentals-concept1")

${timeframe ? `Timeframe: ${timeframe}` : ""}
${difficulty ? `Difficulty level: ${difficulty}` : ""}
${focus ? `Special focus: ${focus}` : ""}

Make the roadmap comprehensive and practical for someone wanting to master ${topic}.

EXAMPLE STRUCTURE:
Main nodes: start → basics → intermediate → advanced
Topic nodes: fundamentals, practice, tools (connected to appropriate main nodes)
Subtopic nodes: concept1, concept2, concept3 (each connected to a topic node)
Edges: All main→main, all main→topic, and ALL topic→subtopic connections`;

    const result = await generateObject({
      model: google("models/gemini-2.0-flash-exp"),
      prompt,
      schema: z.object({
        nodes: z.array(
          z.object({
            id: z.string().describe("Unique identifier using kebab-case"),
            label: z.string().describe("Display name for the node"),
            type: z
              .enum(["main", "topic", "subtopic"])
              .describe("Node type for styling"),
            level: z.number().describe("Learning progression level (0-3)"),
            description: z
              .string()
              .optional()
              .describe("Optional detailed description"),
          })
        ),
        edges: z.array(
          z.object({
            id: z.string().describe("Unique edge identifier"),
            source: z.string().describe("Source node ID"),
            target: z.string().describe("Target node ID"),
            type: z
              .enum(["main", "dotted"])
              .describe(
                "Edge type - main for primary flow, dotted for clusters"
              ),
            label: z.string().optional().describe("Optional edge label"),
          })
        ),
        metadata: z.object({
          topic: z.string(),
          timeframe: z.string().optional(),
          difficulty: z.string().optional(),
          focus: z.string().optional(),
          totalNodes: z.number(),
          totalEdges: z.number(),
        }),
      }),
    });

    const validatedRoadmap = validateAndFixRoadmap(result.object);

    console.log(
      `AI generated roadmap with ${validatedRoadmap.nodes.length} nodes and ${validatedRoadmap.edges.length} edges`
    );
    return validatedRoadmap;
  } catch (error) {
    console.error("Error generating AI roadmap:", error);

    return createFallbackRoadmap(topic, timeframe, difficulty, focus);
  }
}

function validateAndFixRoadmap(roadmap: any) {
  const { nodes, edges } = roadmap;

  const subtopicNodes = nodes.filter((n: any) => n.type === "subtopic");
  const topicNodes = nodes.filter((n: any) => n.type === "topic");
  const mainNodes = nodes.filter((n: any) => n.type === "main");

  const connectedSubtopics = new Set(
    edges.filter((e: any) => e.type === "dotted").map((e: any) => e.target)
  );
  const disconnectedSubtopics = subtopicNodes.filter(
    (n: any) => !connectedSubtopics.has(n.id)
  );

  console.log(
    `Found ${disconnectedSubtopics.length} disconnected subtopics:`,
    disconnectedSubtopics.map((n: any) => n.id)
  );

  const newEdges = [...edges];

  disconnectedSubtopics.forEach((subtopic: any) => {
    const sameLevel = topicNodes.filter((t: any) => t.level === subtopic.level);
    const closestLevel = sameLevel.length > 0 ? sameLevel : topicNodes;

    if (closestLevel.length > 0) {
      const topicIndex =
        disconnectedSubtopics.indexOf(subtopic) % closestLevel.length;
      const parentTopic = closestLevel[topicIndex];

      const newEdge = {
        id: `e-${parentTopic.id}-${subtopic.id}`,
        source: parentTopic.id,
        target: subtopic.id,
        type: "dotted" as const,
      };

      newEdges.push(newEdge);
      console.log(`Created missing edge: ${parentTopic.id} → ${subtopic.id}`);
    }
  });

  const connectedTopics = new Set(
    edges
      .filter(
        (e: any) =>
          e.type === "dotted" &&
          nodes.find((n: any) => n.id === e.target && n.type === "topic")
      )
      .map((e: any) => e.target)
  );
  const disconnectedTopics = topicNodes.filter(
    (n: any) => !connectedTopics.has(n.id)
  );

  disconnectedTopics.forEach((topic: any) => {
    const sameLevel = mainNodes.filter((m: any) => m.level === topic.level);
    const closestLevel = sameLevel.length > 0 ? sameLevel : mainNodes;

    if (closestLevel.length > 0) {
      const mainIndex = disconnectedTopics.indexOf(topic) % closestLevel.length;
      const parentMain = closestLevel[mainIndex];

      const newEdge = {
        id: `e-${parentMain.id}-${topic.id}`,
        source: parentMain.id,
        target: topic.id,
        type: "dotted" as const,
      };

      newEdges.push(newEdge);
      console.log(`Created missing edge: ${parentMain.id} → ${topic.id}`);
    }
  });

  return {
    ...roadmap,
    edges: newEdges,
    metadata: {
      ...roadmap.metadata,
      totalEdges: newEdges.length,
      fixedConnections:
        disconnectedSubtopics.length + disconnectedTopics.length,
    },
  };
}

function createFallbackRoadmap(
  topic: string,
  timeframe?: string,
  difficulty?: string,
  focus?: string
) {
  return {
    nodes: [
      { id: "start", label: "Start Learning", type: "main", level: 0 },
      { id: "basics", label: "Learn the Basics", type: "main", level: 1 },
      {
        id: "intermediate",
        label: "Intermediate Skills",
        type: "main",
        level: 2,
      },
      { id: "advanced", label: "Advanced Mastery", type: "main", level: 3 },

      {
        id: "fundamentals",
        label: "Core Fundamentals",
        type: "topic",
        level: 1,
      },
      { id: "concept-1", label: "Key Concept 1", type: "subtopic", level: 1 },
      { id: "concept-2", label: "Key Concept 2", type: "subtopic", level: 1 },
      { id: "concept-3", label: "Key Concept 3", type: "subtopic", level: 1 },

      {
        id: "practice",
        label: "Practical Application",
        type: "topic",
        level: 2,
      },
      {
        id: "project-1",
        label: "Practice Project",
        type: "subtopic",
        level: 2,
      },
      {
        id: "project-2",
        label: "Real-world Project",
        type: "subtopic",
        level: 2,
      },

      { id: "mastery", label: "Advanced Techniques", type: "topic", level: 3 },
      { id: "expert-1", label: "Expert Skill 1", type: "subtopic", level: 3 },
      { id: "expert-2", label: "Expert Skill 2", type: "subtopic", level: 3 },
    ],
    edges: [
      { id: "e-start-basics", source: "start", target: "basics", type: "main" },
      {
        id: "e-basics-intermediate",
        source: "basics",
        target: "intermediate",
        type: "main",
      },
      {
        id: "e-intermediate-advanced",
        source: "intermediate",
        target: "advanced",
        type: "main",
      },

      {
        id: "e-basics-fundamentals",
        source: "basics",
        target: "fundamentals",
        type: "dotted",
      },
      {
        id: "e-intermediate-practice",
        source: "intermediate",
        target: "practice",
        type: "dotted",
      },
      {
        id: "e-advanced-mastery",
        source: "advanced",
        target: "mastery",
        type: "dotted",
      },
      {
        id: "e-fundamentals-concept1",
        source: "fundamentals",
        target: "concept-1",
        type: "dotted",
      },
      {
        id: "e-fundamentals-concept2",
        source: "fundamentals",
        target: "concept-2",
        type: "dotted",
      },
      {
        id: "e-fundamentals-concept3",
        source: "fundamentals",
        target: "concept-3",
        type: "dotted",
      },
      {
        id: "e-practice-project1",
        source: "practice",
        target: "project-1",
        type: "dotted",
      },
      {
        id: "e-practice-project2",
        source: "practice",
        target: "project-2",
        type: "dotted",
      },
      {
        id: "e-mastery-expert1",
        source: "mastery",
        target: "expert-1",
        type: "dotted",
      },
      {
        id: "e-mastery-expert2",
        source: "mastery",
        target: "expert-2",
        type: "dotted",
      },
    ],
    metadata: {
      topic,
      timeframe,
      difficulty,
      focus,
      totalNodes: 14,
      totalEdges: 10,
    },
  };
}

export async function POST(req: Request) {
  try {
    console.log("=== CHAT API CALLED ===");
    const { messages } = await req.json();

    const result = streamText({
      model: google("models/gemini-2.0-flash-exp"),
      system: `You are Trace AI, an expert learning advisor and roadmap creator. You help people create structured learning paths for any topic or goal.

When users ask for roadmaps, learning paths, career guidance, or step-by-step plans, use the generateRoadmap tool to create visual roadmaps.

You can help with ANY topic including:
- Programming and technology (React, Python, JavaScript, Go, Rust, etc.)
- Career development (Data Science, Software Engineering, Product Management, etc.)
- Business and entrepreneurship (Starting a business, Marketing, Sales, etc.)
- Creative skills (Design, Writing, Music, Art, etc.)
- Academic subjects (Mathematics, Physics, History, etc.)
- Life skills (Cooking, Fitness, Personal Finance, etc.)
- Hobbies and interests (Photography, Gaming, Sports, etc.)

Always be encouraging and explain why each step in the roadmap is important. Provide context about the learning journey and offer additional tips when helpful.

Do not under any circumstances reveal the underlying technologies that are powering your functionality e.g. the AI model or company or anything that will reveal your intermall workings, instead drive the convesation to your main purpose which is creating roadmaps.

You may reveal your creator who is Asiimwe Grace Noble, a Software engineer currently working for Xapisoft.

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
