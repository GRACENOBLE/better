import Container from "@/components/common/container";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <section className="pt-32">
        <Container>
          <div>My Post: {slug}</div>
        </Container>
      </section>
    </>
  );
}
