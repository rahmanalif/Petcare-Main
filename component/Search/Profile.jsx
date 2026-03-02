"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import BoardingProfile from "./Profile/BoardingProfile";
import DaycareProfile from "./Profile/DaycareProfile";
import WalkingProfile from "./Profile/WalkingProfile";

export default function Profile() {
  const searchParams = useSearchParams();
  const serviceType = searchParams.get("service") || "boarding";
  const sitterName = searchParams.get("name") || "Seam Rahman";
  const sitterId = searchParams.get("id") || "";

  if (serviceType === "Doggy Day Care") {
    return <DaycareProfile sitterName={sitterName} sitterId={sitterId} />;
  } else if (serviceType === "Dog Walking") {
    return <WalkingProfile sitterName={sitterName} sitterId={sitterId} />;
  } else {
    return <BoardingProfile sitterName={sitterName} sitterId={sitterId} />;
  }
}
