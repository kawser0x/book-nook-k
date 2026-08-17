import Hero from "@/components/Hero";
import RatingPage from "@/components/RatingPage";
import Image from "next/image";
import LatestRoom from "./latestroom/page";

export default function Home() {
  return (
    <div>
      <Hero />
      <LatestRoom />
      <RatingPage />
    </div>
  );
}
