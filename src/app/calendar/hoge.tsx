'use client';
import { useState } from "react";
import Modal from "../components/Modal";

export function C() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>開く</button>
      <Modal showModal={open} setShowModal={setOpen}>
        ハロー
      </Modal>
    </>
  );
}
