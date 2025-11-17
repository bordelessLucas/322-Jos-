import { ReactNode } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Sidebar />
      <Header />
      <main className="layout__main">
        <div className="layout__content">{children}</div>
      </main>
    </div>
  );
};

