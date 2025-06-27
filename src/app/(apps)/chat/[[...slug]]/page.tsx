import Chat from "@/components/ai/chat";

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <Chat chatId={slug} />;
};

export default page;
