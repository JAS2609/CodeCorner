import type { Models } from "node-appwrite";


export interface QuestionDoc extends Models.Document {
  authorId: string;
  title: string;
  content: string;


}

// Answer document type
export interface AnswerDoc extends Models.Document {
  authorId: string;
  content: string;
  questionId: string;
author: {
  $id: string;
  name: string;
  reputation: number;
}
  upvotesDocuments: Models.DocumentList<Models.Document>;
  downvotesDocuments: Models.DocumentList<Models.Document>;
  comments: Models.DocumentList<Models.Document>;
}
export type CommentDoc = Models.Document & {
  content: string;
  authorId: string;
  author: {
    $id: string;
    name: string;
    reputation: number; 
  };
  type: "question" | "answer";
  typeId: string;
};


export interface Author {
  $id: string;
  name: string;
  reputation: number;
}

export interface QuestionDoc extends Models.Document {
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  author: Author;
  totalVotes: number;
  totalAnswers: number;
   attachmentId?: string;
     reputation: number;
      upvotesCount: number;     
  downvotesCount: number;  
}

// Vote document type
export interface VoteDoc extends Models.Document {
  type: "question" | "answer";
  typeId: string;
  votedById: string;
  voteStatus: "upvoted" | "downvoted";
  
 

}
