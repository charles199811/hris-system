import MainNav from "../user/main-nav";
import Profile from "../user/profile/page";
import { QuickActions } from "../user/profile/quick-actions";
import { AttendanceCard } from "@/components/shared/attendance-card";

const Homepage = async () => {
  return (
    <div className="space-y-6">
      <AttendanceCard />
      <Profile />
      <QuickActions />
      
    </div>
  );
};

export default Homepage;
