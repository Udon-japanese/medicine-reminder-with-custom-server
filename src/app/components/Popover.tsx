'use client';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Drawer } from 'vaul';
import useMediaQuery from '../hooks/useMediaQuery';
import drawerStyles from '@styles/components/popover/drawer.module.scss';
import popoverStyles from '@styles/components/popover/popover.module.scss';

export function Popover({
  children,
  content,
  align = 'center',
  openPopover,
  setOpenPopover,
  mobileOnly,
  isDrawerFullHeight = false,
}: {
  children: ReactNode;
  content: ReactNode | string;
  align?: 'center' | 'start' | 'end';
  openPopover: boolean;
  setOpenPopover: Dispatch<SetStateAction<boolean>>;
  mobileOnly?: boolean;
  isDrawerFullHeight?: boolean;
}) {
  const { isMd } = useMediaQuery();

  if (mobileOnly || !isMd) {
    return (
      <Drawer.Root open={openPopover} onOpenChange={setOpenPopover}>
        <Drawer.Trigger className={drawerStyles.trigger} asChild>
          {children}
        </Drawer.Trigger>
        <Drawer.Overlay className={drawerStyles.overlay} />
        <Drawer.Portal>
          <Drawer.Content
            className={`${drawerStyles.content} ${isDrawerFullHeight ? drawerStyles.fullHeight : ''}`}
          >
            <div className={drawerStyles.body}>
              <div className={drawerStyles.handle} />
              {content}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <PopoverPrimitive.Root open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverPrimitive.Trigger className={popoverStyles.trigger} asChild>
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align={align}
          className={popoverStyles.content}
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
