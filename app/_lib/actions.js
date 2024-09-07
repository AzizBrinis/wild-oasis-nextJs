"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

const { signIn, signOut, auth } = require("./auth");

export async function upadteGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You Must Be Logged In");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,9}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");
  const updateData = { nationality, countryFlag, nationalID };

  const { error } = await supabase
    .from("Guests")
    .update(updateData)
    .eq("id", session.user.guestId)
    .select()
    .single();

  if (error) {
    throw new Error("Guest could not be updated");
  }
  revalidatePath("account/profile");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You Must Be Logged In");
  const userBookings = await getBookings(session.user.guestId);
  const userBookingsIds = userBookings.map((bk) => bk.id);
  if (!userBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to delete this reservation");

  const { error } = await supabase
    .from("Bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservations");
}

export async function updateReservation(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const { numGuests, observations, bookingId } = Object.fromEntries(formData);
  const bookings = await getBookings(session.user.guestId);
  if (!bookings.find((bk) => bk.id == bookingId)) {
    throw new Error("You can't edit this reservation");
  }
  const updatedFields = { numGuests, observations };
  const { error } = await supabase
    .from("Bookings")
    .update(updatedFields)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be updated");
  }
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect("/account/reservations");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: formData.get("numGuests"),
    observations: formData.get("observations"),
  };
  const { error } = await supabase.from("Bookings").insert([newBooking]);

  if (error) {
    throw new Error("Booking could not be created");
  }
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
