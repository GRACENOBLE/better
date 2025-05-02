import Container from "@/components/common/container";
import { TextEffect } from "@/components/ui/text-effect";
const page = () => {
  return (
    <section className="pt-40">
      <Container>
        {" "}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <TextEffect
            preset="fade-in-blur"
            speedSegment={0.3}
            as="h1"
            className="text-balance text-4xl font-medium sm:text-5xl md:text-6xl"
          >
            Create your own path to a better you
          </TextEffect>
          <TextEffect
            per="line"
            preset="fade-in-blur"
            speedSegment={0.3}
            delay={0.5}
            as="p"
            className="mx-auto mt-12 max-w-2xl text-pretty text-lg"
          >
            Embark on a journey of self discovery, create your own path, take
            one step at a time and get one step closer each day to a better you.
          </TextEffect>
        </div>
      </Container>
    </section>
  );
};

export default page;
