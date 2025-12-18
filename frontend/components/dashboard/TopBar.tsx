export default function TopBar() {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      {/* Indices */}
      <div className="flex gap-8">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-gray-500">NIFTY 50</p>
          <p className="text-sm font-semibold text-black">100.2</p>
          <p className="text-xs text-green-600">+0.45%</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-gray-500">SENSEX</p>
          <p className="text-sm font-semibold text-black">100.2</p>
          <p className="text-xs text-green-600">+0.32%</p>
        </div>
      </div>

      {/* Right side user info */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold">
          ZU
        </div>
        <span className="text-sm font-medium">USERID</span>
      </div>
    </header>
  );
}
