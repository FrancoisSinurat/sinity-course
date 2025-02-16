import UserProfilePreference from "@/components/users/UserPreference/UserPref";
import { ProfileCard } from "@/components/UserProfile";

export default function Profile(){
  return(
    <section  className="container mx-auto p-6 flex flex-col items-center justify-center w-full min-h-screen">
    <div className="w-full flex items-center justify-center py-20">
      {/* <ProfileCard/> */}
      <UserProfilePreference/>
    </div>
    </section>
  );
}