import Profile from "../user/profile/page";
import { QuickActions } from "../user/profile/quick-actions";

const Homepage = async () => {
  return <>
    <Profile />
    <QuickActions />
  </>;
};

export default Homepage;
