import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/auth";
import { NextRequest, NextResponse } from "next/server";
import {ID, Query } from "node-appwrite";

export async function POST(request:NextRequest) {
    try {
        //data
        const{votedById,voteStatus,typeId,type}=await request.json()
        //list document
        const response= await databases.listDocuments(db,voteCollection,[
            Query.equal("type",type),
            Query.equal("typeId",typeId),
            Query.equal("votedById",votedById),
        ])
        if(response.documents.length>0){
            //doc exists
            await databases.deleteDocument(db,voteCollection,response.documents[0].$id)
            //dec reputation
            const questionOrAnswer= await databases.getDocument(db,type==="question"?questionCollection:answerCollection,typeId);

            const authorPrefs=await users.getPrefs<UserPrefs>(questionOrAnswer.authorId)
            await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId,{
                reputation:response.documents[0].voteStatus==="upvoted"?Number(authorPrefs.reputation)-1:Number(authorPrefs.reputation)+1
            })



        }
        if (response.documents[0]?.voteStatus!==voteStatus){
            //prev vote doesnt exist
              const doc = await databases.createDocument(db, voteCollection, ID.unique(), {
                type,
                typeId,
                voteStatus,
                votedById,
            });
             const questionOrAnswer= await databases.getDocument(db,type==="question"?questionCollection:answerCollection,typeId);

            const authorPrefs=await users.getPrefs<UserPrefs>(questionOrAnswer.authorId)
            if (response.documents[0]) {
                await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
                    reputation:
                        
                        response.documents[0].voteStatus === "upvoted"
                            ? Number(authorPrefs.reputation) - 1
                            : Number(authorPrefs.reputation) + 1,
                });
            } else {
                await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
                    reputation:
                       
                        voteStatus === "upvoted"
                            ? Number(authorPrefs.reputation) + 1
                            : Number(authorPrefs.reputation) - 1,
                });
            }
            

            const [upvotes, downvotes] = await Promise.all([
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeId", typeId),
                    Query.equal("voteStatus", "upvoted"),
                    Query.equal("votedById", votedById),
                    Query.limit(1), // for optimization as we only need total
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeId", typeId),
                    Query.equal("voteStatus", "downvoted"),
                    Query.equal("votedById", votedById),
                    Query.limit(1), // for optimization as we only need total
                ]),
            ]);

            return NextResponse.json(
                {
                    data: { document: doc, voteResult: upvotes.total - downvotes.total },
                    message: response.documents[0] ? "Vote Status Updated" : "Voted",
                },
                {
                    status: 201,
                }
            );
        }

        const [upvotes, downvotes] = await Promise.all([
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "upvoted"),
                Query.equal("votedById", votedById),
                Query.limit(1), // for optimization as we only need total
            ]),
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "downvoted"),
                Query.equal("votedById", votedById),
                Query.limit(1), // for optimization as we only need total
            ]),
        ]);

        return NextResponse.json(
            {
                data: { 
                    document: null, voteResult: upvotes.total - downvotes.total 
                },
                message: "Vote Withdrawn",
            },
            {
                status: 200,
            }
        );
    } catch (error: unknown) {
    if (error instanceof Error) {
        window.alert(error.message);
    } else {
        window.alert("Error deleting answer");
    }
    }
}