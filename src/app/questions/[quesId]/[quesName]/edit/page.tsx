import { db, questionCollection } from "@/models/name"; 
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";
import { QuestionDoc } from "@/types/appwrite"; // import your custom type

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ quesId: string; quesName: string }>;
}

export default async function Page({ params }: PageProps) {
  const { quesId, quesName } = await params;

  if (!quesId) throw new Error("Missing quesId");

  const question = await databases.getDocument<QuestionDoc>(db, questionCollection, quesId);

  return <EditQues question={question} />;
}
