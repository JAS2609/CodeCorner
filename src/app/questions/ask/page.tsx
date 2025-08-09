// src/app/questions/ask/page.tsx
import React from "react";
import Link from "next/link";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import QuestionForm from "@/components/QuestionForm";

export default function AskQuestionPage() {
  return (
    <div className="container mx-auto px-4 pb-20 pt-36">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ask a Question</h1>
        <Link href="/questions">
          <RainbowButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Back to Questions
            </span>
          </RainbowButton>
        </Link>
      </div>

      <div className="max-w-3xl space-y-6">
        
        <QuestionForm />
      </div>
    </div>
  );
}
