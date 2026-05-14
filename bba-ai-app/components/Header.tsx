export default function Header() {
  return (
    <header style={{ background: '#232F3E' }} className="shadow-aws-md">
      <div className="max-w-5xl mx-auto px-6 py-0 flex items-center justify-between" style={{ height: 60 }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center font-bold text-sm text-white"
            style={{ background: '#FF9900', borderRadius: 2, color: '#16191F' }}
          >
            CA
          </div>
          <div>
            <span className="text-white font-semibold text-base leading-none">Campus AI</span>
            <span className="text-gray-400 text-xs block leading-none mt-0.5">by Infinite Solutions</span>
          </div>
        </div>
        <div className="text-gray-400 text-sm font-medium tracking-wide">
          Content Generation Studio
        </div>
      </div>
    </header>
  );
}
