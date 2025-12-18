export default function TopBar() {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4 w-fit ">
      {/* Indices */}
      <div className="flex gap-5">
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
      
    </header>
  );
}
