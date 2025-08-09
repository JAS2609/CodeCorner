import React from "react";
import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import EditQues from "./EditQues";
import { QuestionDocument } from "@/components/QuestionCard";

interface EditQuesPageProps {
  params: {
    quesId: string;
    quesName: string;
  };
}

const Page = async ({ params }: EditQuesPageProps): Promise<JSX.Element> => {
  const doc = await databases.getDocument<QuestionDocument>(
    db,
    questionCollection,
    params.quesId
  );

  const question: QuestionDocument = {
    ...doc,
    title: doc.title ?? "",
    authorId: doc.authorId ?? "",
  };

  return <EditQues question={question} />;
};

export default Page;
