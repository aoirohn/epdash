import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard" }];
};

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <nav className="flex gap-10">
        <Link to="/dashboard" reloadDocument className="text-blue-500 hover:underline text-3xl">
          Dashboard
        </Link>
        <Link to="/image" reloadDocument className="text-blue-500 hover:underline text-3xl">
          Image
        </Link>
      </nav>
    </div>
  );
}
