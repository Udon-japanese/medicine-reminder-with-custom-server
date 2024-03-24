import { Dispatch, SetStateAction } from 'react';
import Modal from '../Modal';
import LoginForm from './LoginForm';

export default function LoginModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <LoginForm />
    </Modal>
  );
}
