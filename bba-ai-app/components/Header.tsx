export default function Header() {
  return (
    <header className="bg-brand-purple shadow-md">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CA</span>
          </div>
          <div>
            <span className="text-white font-bold text-lg leading-none">Campus AI</span>
            <span className="text-purple-200 text-xs block leading-none mt-0.5">by Infinite Solutions</span>
          </div>
        </div>
        <div className="text-purple-200 text-sm font-medium tracking-wide">
          Content Generation Studio
        </div>
      </div>
    </header>
  );
}
