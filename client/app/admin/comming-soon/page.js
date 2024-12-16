import Head from "next/head";

export const metadata = {
  title: "Comming Soon",
  description: "Tính năng đang hoàn thiện và sẽ sớm ra mắt",
};

function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#022C25]">
      <Head>
        <title>Coming Soon</title>
        <meta name="description" content="Our website is coming soon!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#B5905B] mb-8">Coming Soon</h1>
        <p className="text-xl text-white mb-8">
          We are working hard to bring you something amazing!
        </p>
        <p className="text-lg text-white">Stay tuned for updates.</p>
      </div>
    </div>
  );
}

export default Page;
