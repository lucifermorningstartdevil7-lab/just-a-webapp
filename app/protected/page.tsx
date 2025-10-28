import { redirect } from "next/navigation";

export default function ProtectedEntryPage() {
  redirect("/protected/overview");
}
