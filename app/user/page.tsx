import { HeroHeader } from "@/components/user-dashboard/hero-header"
import { HomeFeed } from "@/components/user-dashboard/home-feed"
import { RightPanel } from "@/components/user-dashboard/right-panel"

export default function UserHomePage() {
  return (
    <div className="space-y-6">
      <HeroHeader />

      <div className="grid grid-cols-12 gap-6">
        {/* Center feed */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <HomeFeed />
        </div>

        {/* Right panel */}
        <div className="col-span-12 lg:col-span-4">
          <RightPanel />
        </div>
      </div>
    </div>
  )
}