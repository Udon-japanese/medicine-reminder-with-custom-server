import Sidebar from '../components/sidebar/Sidebar';

export default function MedicinesLayout({ children }: { children: React.ReactNode }) {
  return <Sidebar>{children}</Sidebar>;
}
