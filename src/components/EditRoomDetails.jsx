"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaEdit, FaTimes } from "react-icons/fa";

const EditRoomDetails = ({ id, initialData }) => {
  const modalRef = useRef(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        image: initialData.image || "",
        shortDescription: initialData.shortDescription || "",
        floor: initialData.floor || "",
        seatCapacity: initialData.seatCapacity || "",
        hourlyRate: initialData.hourlyRate || "",
        amenities: Array.isArray(initialData.amenities)
          ? initialData.amenities.join(", ")
          : initialData.amenities || "",
      });
    }
  }, [initialData, reset]);

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

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      hourlyRate: Number(data.hourlyRate),
      amenities: data.amenities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    };

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const res = await fetch(`${baseUrl}/rooms/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });

    if (res.ok) {
      toast.success("Room updated successfully!");
      closeModal();
      router.refresh();
    } else {
      toast.error("Failed to update room.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn btn-outline btn-accent w-full gap-1.5">
        <FaEdit className="h-3.5 w-3.5" /> Edit
      </button>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl border border-base-300 bg-base-100 p-6">
          <div className="flex items-center justify-between border-b border-base-200 pb-3">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <FaEdit /> Edit Study Room
            </h3>
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-bold">Room Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Silent Solo Study Pod"
                className={`input input-bordered input-sm w-full sm:input-md ${
                  errors.name ? "input-error" : ""
                }`}
                {...register("name", { required: "Room name is required" })}
              />
              {errors.name && (
                <span className="mt-1 text-xs text-error">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-bold">Image URL</span>
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                className={`input input-bordered input-sm w-full sm:input-md ${
                  errors.image ? "input-error" : ""
                }`}
                {...register("image", { required: "Image URL is required" })}
              />
              {errors.image && (
                <span className="mt-1 text-xs text-error">
                  {errors.image.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-bold">
                  Short Description
                </span>
              </label>
              <textarea
                rows="2"
                maxLength={120}
                placeholder="Brief description..."
                className={`textarea textarea-bordered w-full text-sm ${
                  errors.shortDescription ? "textarea-error" : ""
                }`}
                {...register("shortDescription", {
                  required: "Description is required",
                  maxLength: {
                    value: 120,
                    message: "Keep description under 120 characters",
                  },
                })}
              />
              {errors.shortDescription && (
                <span className="mt-1 text-xs text-error">
                  {errors.shortDescription.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-bold">Floor</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Floor 3"
                  className={`input input-bordered input-sm w-full sm:input-md ${
                    errors.floor ? "input-error" : ""
                  }`}
                  {...register("floor", { required: "Floor is required" })}
                />
                {errors.floor && (
                  <span className="mt-1 text-xs text-error">
                    {errors.floor.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-bold">
                    Seat Capacity
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2–4 people"
                  className={`input input-bordered input-sm w-full sm:input-md ${
                    errors.seatCapacity ? "input-error" : ""
                  }`}
                  {...register("seatCapacity", {
                    required: "Capacity is required",
                  })}
                />
                {errors.seatCapacity && (
                  <span className="mt-1 text-xs text-error">
                    {errors.seatCapacity.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-bold">
                    Hourly Rate ($)
                  </span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 5"
                  className={`input input-bordered input-sm w-full sm:input-md ${
                    errors.hourlyRate ? "input-error" : ""
                  }`}
                  {...register("hourlyRate", {
                    required: "Rate is required",
                    min: { value: 0, message: "Rate cannot be negative" },
                  })}
                />
                {errors.hourlyRate && (
                  <span className="mt-1 text-xs text-error">
                    {errors.hourlyRate.message}
                  </span>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-bold">
                  Amenities (Comma separated)
                </span>
              </label>
              <input
                type="text"
                placeholder="Wi-Fi, Whiteboard, Power Outlets, AC"
                className={`input input-bordered input-sm w-full sm:input-md ${
                  errors.amenities ? "input-error" : ""
                }`}
                {...register("amenities", {
                  required: "At least one amenity is required",
                })}
              />
              {errors.amenities && (
                <span className="mt-1 text-xs text-error">
                  {errors.amenities.message}
                </span>
              )}
            </div>

            <div className="modal-action mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="btn btn-ghost btn-sm">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-sm text-white">
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button disabled={isSubmitting}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditRoomDetails;
