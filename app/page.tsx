import Navbar from '../components/Navbar';
import SwapCard from '../components/SwapCard';

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#222222]">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[1280px] items-start justify-center px-4 pb-16 pt-10">
        <SwapCard />
      </div>
    </main>
  );
}
