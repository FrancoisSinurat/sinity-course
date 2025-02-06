import { ProfileCard } from "@/components/UserProfile";

export default function Profile(){
  return(
    <section  className="flex flex-col items-center justify-center w-full min-h-screen">
    <div className="w-full flex items-center justify-center">
      <ProfileCard/>
    </div>
    </section>
  );
}