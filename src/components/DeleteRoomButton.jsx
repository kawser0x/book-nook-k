"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

export default function DeleteRoomButton({ id, roomName }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const modalRef = useRef(null);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const res = await fetch(`${baseUrl}/rooms/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Room deleted successfully!");
      closeModal();
      router.push("/rooms");
      router.refresh();
    } else {
      toast.error("Failed to delete the room.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-error btn-outline w-full gap-1.5 hover:text-white">
        <FaTrash className="h-3 w-3" /> Delete
      </button>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box border border-base-300 bg-base-100">
          <div className="flex items-center gap-3 text-error">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
              <FaExclamationTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-base-content">
              Delete Study Room
            </h3>
          </div>

          <p className="py-4 text-sm text-base-content/70">
            Are you sure you want to delete{" "}
            <strong className="text-base-content">
              "{roomName || "this room"}"
            </strong>
            ? This action cannot be undone and will remove all associated
            booking slots.
          </p>

          <div className="modal-action">
            <button
              type="button"
              onClick={closeModal}
              disabled={isDeleting}
              className="btn btn-ghost btn-sm">
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-error btn-sm text-white">
              {isDeleting ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button disabled={isDeleting}>close</button>
        </form>
      </dialog>
    </>
  );
}
