import { Hero } from '@/components/Hero';

export default function HomePage() {
  return (
    <div className="flex flex-col ">
      <section className='flex items-center justify-center h-screen'>
      <Hero />
      </section>
    </div>
  );
}
