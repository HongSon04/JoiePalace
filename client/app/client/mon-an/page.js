import Footer from "@/app/_components/FooterClient";
import HeroSection from "./HeroSection";
import DishesTabs from "./DishesTabs";

export const metadata = {
  title: "Món ăn",
  description: "Trang món ăn Joie Palace",
};

function Page() {
  return (
    <>
      <HeroSection />
      <DishesTabs />
      <Footer />
    </>
  );
}

export default Page;
