import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";
import { QuestionDocument } from "@/components/QuestionCard"; // <-- Your QuestionDocument interface

const Page = async ({
  params,
}: {
  params: { quesId: string; quesName: string };
}) => {
  const doc = (await databases.getDocument(
    db,
    questionCollection,
    params.quesId
  )) as QuestionDocument;

  // Ensure it matches QuestionDocument structure
  const question: QuestionDocument = {
    ...doc,
    title: doc.title ?? "",
    authorId: doc.authorId ?? "",
  };

  return <EditQues question={question} />;
};

export default Page;
