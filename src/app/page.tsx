import { redirect } from "next/navigation";

/** The catalogue lives at /products; send the bare root there. */
export default function Home() {
  redirect("/products");
}
