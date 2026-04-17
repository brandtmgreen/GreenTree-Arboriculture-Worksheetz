import React, { useState, useEffect } from 'react';
import { TreePine, ShieldAlert, ClipboardCheck, Menu, X, Printer, Download, Camera, Leaf, ClipboardList, MessageSquare, Map, CloudLightning, FileText, Table, WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // In a real app, this would trigger a PDF generation/download
    }, 2000);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    
    // Simulate data gathering and CSV generation
    setTimeout(() => {
      const activeLabel = navItems.find(i => i.id === activeTab)?.label || 'Worksheet';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `GreenTree_${activeLabel.replace(/\s+/g, '_')}_${timestamp}.csv`;
      
      // Simple CSV simulation
      const csvContent = "data:text/csv;charset=utf-8,Field,Value\n" + 
        "Report Type," + activeLabel + "\n" +
        "Export Date," + new Date().toLocaleString() + "\n" +
        "Status,Draft\n";
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 1500);
  };

  const printAllBlank = () => {
    document.body.classList.add('print-all-blank');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-all-blank');
    }, 500);
  };

  const navItems = [
    { id: 'briefing', label: 'Job Briefing', icon: ClipboardCheck },
    { id: 'risk', label: 'Risk Assessment', icon: ShieldAlert },
    { id: 'health', label: 'Health Assessment', icon: TreePine },
    { id: 'workorder', label: 'Work Order', icon: ClipboardList },
    { id: 'consultation', label: 'Consultation', icon: MessageSquare },
    { id: 'survey', label: 'Tree Survey', icon: Map },
    { id: 'storm', label: 'Storm Damage', icon: CloudLightning },
    { id: 'safety', label: 'Safety Meeting', icon: ShieldAlert },
    { id: 'equipment', label: 'Equipment Log', icon: ClipboardList },
    { id: 'media', label: 'Media & Docs', icon: Camera },
  ];

  return (
    <div className="min-h-screen flex flex-col print:hidden">
      {/* Status Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500 text-white text-xs sm:text-sm font-bold text-center py-2 px-4 shadow-sm z-50 relative flex items-center justify-center gap-2"
          >
            <WifiOff className="w-4 h-4" />
            Offline Mode: Changes will be synced when you reconnect.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-brand-green text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="bg-white p-2 rounded-xl shadow-inner transform group-hover:rotate-12 transition-transform duration-300">
                  <div className="relative">
                    <TreePine className="text-brand-green w-7 h-7" />
                    <Leaf className="absolute -top-1 -right-1 text-brand-vibrant w-3 h-3 animate-pulse" />
                  </div>
                </div>
                <div className="absolute -inset-1 bg-white/20 rounded-xl blur-sm -z-10 group-hover:bg-white/40 transition-colors"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-black leading-none tracking-tight flex items-center gap-1">
                  Green<span className="text-brand-vibrant">Tree</span>
                </h1>
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-4 bg-white/40"></div>
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.3em] text-white/90">Arboriculture</p>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeTab === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <div className="h-6 w-[1px] bg-white/20 ml-2"></div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? 'Online' : 'Offline'}
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-white/10 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand-green border-t border-white/10"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${
                      activeTab === item.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {navItems.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button className="btn-secondary text-xs sm:text-sm py-1.5 flex-1 sm:flex-none" onClick={() => window.print()}>
              <Printer className="w-3.5 h-3.5 sm:w-4 h-4" />
              Print Current
            </button>
            <button className="btn-secondary text-xs sm:text-sm py-1.5 flex-1 sm:flex-none" onClick={printAllBlank}>
              <FileText className="w-3.5 h-3.5 sm:w-4 h-4" />
              Print All Blank
            </button>
            <button 
              onClick={handleExportCSV}
              disabled={isExporting}
              className="btn-secondary text-xs sm:text-sm py-1.5 flex-1 sm:flex-none disabled:opacity-50"
            >
              {isExporting ? (
                <div className="w-3.5 h-3.5 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Table className="w-3.5 h-3.5 sm:w-4 h-4" />
              )}
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary text-xs sm:text-sm py-1.5 flex-1 sm:flex-none disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Download className="w-3.5 h-3.5 sm:w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save PDF'}
            </button>
          </div>
        </div>
        
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="bg-brand-green p-1.5 rounded-lg">
              <TreePine className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-sm tracking-tight">Green<span className="text-brand-vibrant">Tree</span></span>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} GreenTree Arboriculture. All rights reserved.
          </div>
        </div>
      </footer>
      {/* Monkey Mascot Floating */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <div className="relative">
          <div className="absolute -inset-2 bg-brand-green/20 rounded-full blur-md group-hover:bg-brand-vibrant/20 transition-colors animate-pulse"></div>
          <button className="relative w-14 h-14 bg-white rounded-full shadow-2xl border-2 border-brand-green flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:border-brand-vibrant transition-all duration-300">
            <span className="text-2xl transform group-hover:-rotate-12 transition-transform">🐒</span>
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center text-lg">💡</div>
              <div>
                <p className="text-xs font-bold text-brand-green uppercase tracking-wider mb-1">Arborist Tip</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  "Don't forget to check for nesting birds before starting any pruning work today!"
                </p>
              </div>
            </div>
            <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
