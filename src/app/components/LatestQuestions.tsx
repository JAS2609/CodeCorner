import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/auth";
import { Query } from "node-appwrite";
import React from "react";

import type { QuestionDocument } from "@/components/QuestionCard"; 

const LatestQuestions = async () => {
    const questions = await databases.listDocuments(db, questionCollection, [
        Query.limit(5),
        Query.orderDesc("$createdAt"),
    ]);
    console.log("Fetched Questions:", questions);

    const questionDocs: QuestionDocument[] = await Promise.all(
        questions.documents.map(async ques => {
            const [author, answers, votes] = await Promise.all([
                users.get<UserPrefs>(ques.authorId),
                databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", ques.$id),
                    Query.limit(1), // for optimization
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "question"),
                    Query.equal("typeId", ques.$id),
                    Query.limit(1), // for optimization
                ]),
            ]);

            return {
                $id: ques.$id,
                title: ques.title,
                content: ques.content,
                tags: ques.tags,
                totalAnswers: answers.total,
                totalVotes: votes.total,
                author: {
                    $id: author.$id,
                    reputation: author.prefs.reputation,
                    name: author.name,
                },
                // Add any other required QuestionDocument properties here if missing
            } as QuestionDocument;
        })
    );

    return (
        <div className="space-y-6">
            {questionDocs.map(question => (
                <QuestionCard key={question.$id} ques={question} />
            ))}
        </div>
    );
};

export default LatestQuestions;
