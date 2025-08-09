import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";
import { QuestionDocument } from "@/components/QuestionCard";

const Page = async ({
  params,
}: {
  params: { quesId: string; quesName: string };
}) => {
  const doc = await databases.getDocument(
    db,
    questionCollection,
    params.quesId
  );

  // Manually create a QuestionDocument from the returned document,
  // providing defaults for required fields if missing
const question: QuestionDocument = {
  ...doc,
  title: doc.title ?? "",
  content: doc.content ?? "",
  tags: doc.tags ?? [],
  totalVotes: doc.totalVotes ?? 0,
  totalAnswers: doc.totalAnswers ?? 0,
  authorId: doc.authorId ?? "",
  author: doc.author ?? { $id: "", name: "", reputation: 0 },
  attachmentId: doc.attachmentId, // now valid
};


  return <EditQues question={question} />;
};

export default Page;
