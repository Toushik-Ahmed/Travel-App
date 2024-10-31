import Menubar from '@/components/components/Menubar';
import React from 'react';

type Props = {};

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div className="flex justify-center mt-4">
        <Menubar />
      </div>

      {children}
    </div>
  );
};

export default layout;
