"use client";

import { RoastResponse } from "@/lib/types";

interface Props {
  data: RoastResponse;
}

export default function RoastDisplay({ data }: Props) {
  return <div><p>{data.roast}</p></div>;
}
