import { Hero } from '@/components/Hero';
import Login from '@/components/LoginCard';

export default function HomePage() {
  return (
    <div className="flex flex-col ">
      <section className='flex items-center justify-center h-screen'>
      <Login />
      </section>
    </div>
  );
}
