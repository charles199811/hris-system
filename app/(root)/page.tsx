import Profile from "../user/profile/page";
import { QuickActions } from "../user/profile/quick-actions";
import { AttendanceCard } from "@/components/attendance/attendance-card";

const Homepage = async () => {
  return (
    <div className="space-y-6">
      <Profile />

      {/* Attendance */}
      <AttendanceCard />

      <QuickActions />
    </div>
  );
};

export default Homepage;
