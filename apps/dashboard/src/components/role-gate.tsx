"use client";

interface RoleGateProps {
  role: string;
  requiredRole?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({
  role,
  requiredRole = "admin",
  children,
  fallback = null,
}: RoleGateProps) {
  if (role !== requiredRole) return <>{fallback}</>;
  return <>{children}</>;
}
