// src/app/questions/[quesId]/[quesName]/edit/page.tsx
import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

// Define the type for the component props
interface PageProps {
  params: {
    quesId: string;
    quesName: string;
  };
}

const Page = async (props: PageProps) => {
  // Destructure the 'params' object inside the function
  const { quesId } = props.params;

  const question = await databases.getDocument(db, questionCollection, quesId);

  return <EditQues question={question} />;
};

export default Page;