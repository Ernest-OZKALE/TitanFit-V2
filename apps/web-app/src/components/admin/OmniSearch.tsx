import { Search, Command } from "lucide-react";

export function OmniSearch() {
    return (
        <div className="relative w-full max-w-2xl mx-auto mb-12 group">
            <div className="absolute inset-0 bg-titan-gold/20 blur-2xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

            <div className="relative flex items-center bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl group-hover:border-titan-gold/50 transition-colors">
                <div className="pl-6 text-gray-400">
                    <Search size={24} />
                </div>
                <input
                    type="text"
                    placeholder="Search User, Transaction, or Logs..."
                    className="w-full bg-transparent border-none text-white text-lg px-6 py-6 focus:ring-0 placeholder:text-gray-600"
                />
                <div className="pr-6 flex items-center gap-2">
                    <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-medium text-gray-400 opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>
        </div>
    );
}
