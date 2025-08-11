"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { VoteDoc } from "@/types/appwrite";

interface VoteList {
  total: number;
  documents: VoteDoc[];
}

const VoteButtons = ({
  type,
  id,
  upvotes,
  downvotes,
  className,
}: {
  type: "question" | "answer";
  id: string;
  upvotes: VoteList;
  downvotes: VoteList;
  className?: string;
}) => {
  const [votedDocument, setVotedDocument] = React.useState<VoteDoc | null>(); 
  const [voteResult, setVoteResult] = React.useState<number>(
    upvotes.total - downvotes.total
  );

  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      if (user) {
        const response = await databases.listDocuments<VoteDoc>(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", id),
          Query.equal("votedById", user.$id),
        ]);
        setVotedDocument(() => response.documents[0] || null);
      }
    })();
  }, [user, id, type]);

  const toggleVote = async (voteStatus: "upvoted" | "downvoted") => {
    if (!user) return router.push("/login");
    if (votedDocument === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus,
          type,
          typeId: id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw data;

      setVoteResult(() => data.data.voteResult);
      setVotedDocument(() => data.data.document);
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  return (
    <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-4", className)}>
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
          votedDocument?.voteStatus === "upvoted"
            ? "border-orange-500 text-orange-500"
            : "border-white/30"
        )}
        onClick={() => toggleVote("upvoted")}
      >
        <IconCaretUpFilled />
      </button>
      <span>{voteResult}</span>
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
          votedDocument?.voteStatus === "downvoted"
            ? "border-orange-500 text-orange-500"
            : "border-white/30"
        )}
        onClick={() => toggleVote("downvoted")}
      >
        <IconCaretDownFilled />
      </button>
    </div>
  );
};

export default VoteButtons;
