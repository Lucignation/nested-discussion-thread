"use client";

import { useState } from "react";
import { CommentNode } from "../types/Comment";

export default function Page() {
  const [comments, setComments] = useState<CommentNode[]>([]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Nested Discussion Thread</h1>
    </main>
  );
}
