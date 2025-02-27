import { Hero } from '@/components/Hero';
import DashboardPage from './dashboard/page';
// import Login from '@/components/LoginCard';

export default function HomePage() {
  return (
    <div className="flex flex-col ">
      <DashboardPage/>
      {/* <section className='flex items-center justify-center h-screen'> */}
      {/* <Login /> */}
      {/* </section> */}
    </div>
  );
}
