"use client";

function Loading() {
  return (
    <div className="fixed inset-0 z-50 w-screen h-screen flex justify-center items-center bg-white">
      <div className="w-full gap-x-2 flex justify-center items-center flex-col">
        <h1 className="text-gold uppercase text-3xl animate-bounce">
          JOIE PALACE
        </h1>
      </div>
    </div>
  );
}

export default Loading;
