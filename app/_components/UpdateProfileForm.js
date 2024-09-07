"use client";

import Image from "next/image";
import { upadteGuest } from "../_lib/actions";
import { useFormStatus } from "react-dom";

function UpdateProfileForm({ children, guest }) {
  // const countryFlag = "pt.jpg";
  // const nationality = "portugal";

  return (
    <form
      action={upadteGuest}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          disabled
          defaultValue={guest.name}
          name="fullName"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          disabled
          name="email"
          defaultValue={guest.email}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          <img
            defaultValue={guest.countryFlag}
            src={guest.countryFlag}
            alt="Country flag"
            className="h-5 rounded-sm object-cover"
            name="countryFlag"
          />
        </div>

        {children}
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>
        <input
          name="nationalID"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultValue={guest.nationalID}
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <Button pendingLabel="Updating...">Update profile</Button>
      </div>
    </form>
  );
}

export function Button({ children, pendingLabel }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={pending}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export default UpdateProfileForm;
