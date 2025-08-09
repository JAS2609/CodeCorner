import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";


interface PageProps {
  params: {
    quesId: string;
    quesName: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const question = await databases.getDocument(db, questionCollection, params.quesId);

  return <EditQues question={question} />;
};

export default Page;