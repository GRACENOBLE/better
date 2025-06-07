import Chat from "@/components/ai/chat";
import Container from "@/components/common/container";

const page = () => {
  return (
    <section>
      <Container>
        <div className=" mx-auto max-w-2xl">
          <Chat />
        </div>
      </Container>
    </section>
  );
};

export default page;
