import type { Metadata } from "next";
import { ProfileDetails } from "@/components/ProfileDetails";

export const metadata: Metadata = { title: "Profile · NewsFeed" };

export default function ProfilePage() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">The person behind the moments</p>
        <h1>Your profile</h1>
        <p className="muted">A little introduction.</p>
      </div>
      <ProfileDetails />
    </>
  );
}
