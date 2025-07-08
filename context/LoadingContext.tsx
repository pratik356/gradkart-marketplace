"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const LoadingContext = createContext({
  loading: false,
  show: () => {},
  hide: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const show = () => setLoading(true);
  const hide = () => setLoading(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loader on route change
    show();
    const timeout = setTimeout(() => hide(), 800); // Simulate loading duration
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ loading, show, hide }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  return useContext(LoadingContext);
} 