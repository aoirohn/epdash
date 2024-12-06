import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
  ];
};


export default function Index() {
  return (
    <div>
      <Link to="/dashboard">dashboard</Link>
    </div>
  );
}
