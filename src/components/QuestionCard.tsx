"use client";

import React from "react";
import { ShineBorder } from "./magicui/shine-border";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";

// Strongly typed model for Question documents
export interface QuestionDocument extends Models.Document {
  title: string;
  content: string;
  tags: string[];
  totalVotes: number;
  totalAnswers: number;
  authorId: string;
  author: {
    $id: string;
    name: string;
    reputation: number;
  };
  attachmentId?: string;  // add this line
}


const QuestionCard = ({ ques }: { ques: QuestionDocument }) => {

  const ref = React.useRef<HTMLDivElement>(null);

  

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/20 bg-white/5 p-4 duration-200 hover:bg-white/10 sm:flex-row"
    >
      <ShineBorder duration={12}  />
      <div className="relative shrink-0 text-sm sm:text-right">
        <p>{ques.totalVotes} votes</p>
        <p>{ques.totalAnswers} answers</p>
      </div>
      <div className="relative w-full">
        <Link
          href={`/questions/${ques.$id}/${slugify(ques.title)}`}
          className="text-orange-500 duration-200 hover:text-orange-600"
        >
          <h2 className="text-xl">{ques.title}</h2>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {ques.tags.map((tag) => (
            <Link
              key={tag}
              href={`/questions?tag=${tag}`}
              className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
            >
              #{tag}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-1">
            <picture>
              <img
                src={avatars.getInitials(ques.author.name, 24, 24)}
                alt={ques.author.name}
                className="rounded-lg"
              />
            </picture>
            <Link
              href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
              className="text-orange-500 hover:text-orange-600"
            >
              {ques.author.name}
            </Link>
            <strong>{ques.author.reputation}</strong>
          </div>
          <span>asked {convertDateToRelativeTime(new Date(ques.$createdAt))}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
