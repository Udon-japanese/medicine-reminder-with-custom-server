import { ReactNode } from 'react';
import Sidebar from '../components/sidebar/Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return <Sidebar>{children}</Sidebar>;
}
