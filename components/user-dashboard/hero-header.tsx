export function HeroHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 p-8 text-white shadow">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold leading-tight">
          Hi <span className="font-bold">Employee Name</span>,
          <br />
          glad you&apos;re here 👋
        </h1>
      </div>

      {/* Logo block */}
      <div className="absolute right-6 top-6 hidden h-28 w-56 rounded-xl bg-slate-900/70 p-6 text-white lg:block">
        <div className="text-sm opacity-80">Intelura Logo</div>
      </div>
    </div>
  )
}