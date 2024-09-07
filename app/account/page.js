import { auth } from "../_lib/auth";

export const metadata = {
  title: "My Account",
};

export default async function Page() {
  const session = await auth();
  const firstName = session.user.name.split(" ").at(0);
  console.log(session);
  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Hello {firstName}! Welcome to your acoount
    </h2>
  );
}
