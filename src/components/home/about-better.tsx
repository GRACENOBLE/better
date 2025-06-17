import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import CustomButton from "../CustomButton";

export default function ContentSection() {
  return (
    <section className="py-16 md:py-28">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <img
          className="rounded-(--radius)  border h-[500px] w-full object-cover"
          src="/images/canvas.png"
          alt="team image"
          height=""
          width=""
          loading="lazy"
        />

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-title font-semibold">What is better?</h2>
          <div className="space-y-6">
            <p>
              Better is an AI powered roadmapping tool that improves your planning 10 fold. Create a knowledge based plan and see it through from start to finish.
            </p>

            <CustomButton
              className="gap-1 pr-1.5"
            >
              <Link href="#">
                <span>Learn More</span>
              </Link>
            </CustomButton>
          </div>
        </div>
      </div>
    </section>
  );
}
