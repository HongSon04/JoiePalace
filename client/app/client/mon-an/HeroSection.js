import heroBanner from "@/public/images-client/banners/dishes-hero-banner.png";
import Image from "next/image";

function HeroSection() {
  return (
    <section className="responsive-container !pt-44 text-white text-center font-gilroy p-5 flex flex-col flex-center gap-5 relative min-h-[400px]">
      <Image
        src={heroBanner}
        fill={true}
        sizes="(max-width: 768px) 100vw, 768px"
        alt="hero image"
        className="object-cover"
      />
      <div className="absolute inset-0 flex-center ">
        <div className="max-w-[440px] flex flex-col">
          <h1 className="text-gold text-6xl font-semibold">Món ăn</h1>
          <p className="text-md leading-6 text-white mt-3">
            Chào mừng đến với thiên đường ẩm thực Joie Palace, nơi nâng niu vị
            giác của quý khách{" "}
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
