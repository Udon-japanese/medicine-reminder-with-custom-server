import Sidebar from '../components/sidebar/Sidebar';

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      {children}
    </Sidebar>
  );
}
