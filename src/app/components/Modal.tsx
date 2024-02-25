'use client';
import { Drawer } from 'vaul';
import * as Dialog from '@radix-ui/react-dialog';
import { Dispatch, SetStateAction } from 'react';
import useMediaQuery from '../hooks/useMediaQuery';
import { useRouter } from 'next/navigation';
import drawerStyles from '@styles/components/modal/drawer.module.scss';
import dialogStyles from '@styles/components/modal/dialog.module.scss';

type Props = {
  children: React.ReactNode;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  desktopOnly?: boolean;
  preventDefaultClose?: boolean;
  fullScreenOnMobile?: boolean;
};

export default function Modal({
  children,
  showModal,
  setShowModal,
  onClose,
  desktopOnly,
  preventDefaultClose,
  fullScreenOnMobile,
}: Props) {
  const { isMd } = useMediaQuery();
  const router = useRouter();

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return;
    }

    if (onClose) {
      onClose();
      return;
    }

    if (setShowModal) {
      setShowModal(false);
    } else {
      router.back();
    }
  };

  if ((isMd && !desktopOnly) || (!isMd && fullScreenOnMobile)) {
    return (
      <Dialog.Root
        open={setShowModal ? showModal : true}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay
            id="modal-backdrop"
            className={dialogStyles.overlay}
          />
          <Dialog.Content className={`${dialogStyles.content} ${!isMd && fullScreenOnMobile ? dialogStyles.fullScreen : ''}`}>
            {children}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Drawer.Root
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) {
          closeModal({ dragged: true });
        }
      }}
    >
      <Drawer.Overlay className={drawerStyles.overlay} />
      <Drawer.Portal>
        <Drawer.Content className={drawerStyles.content}>
          <div className={drawerStyles.body}>
            <div className={drawerStyles.handle} />
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
