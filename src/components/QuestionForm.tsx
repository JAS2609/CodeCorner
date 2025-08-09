"use client";

import RTE from "@/components/RTE";
import { Meteors } from "@/components/magicui/meteors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import slugify from "@/utils/slugify";
import { IconX } from "@tabler/icons-react";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { databases, storage } from "@/models/client/config";
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { Confetti } from "@/components/magicui/confetti";

type QuestionDocument = {
  $id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  attachmentId?: string | null;
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4",
        className
      )}
    >
      <Meteors number={30} />
      {children}
    </div>
  );
};

const QuestionForm = ({ question }: { question?: QuestionDocument }) => {
  const { user } = useAuthStore();
  const [tag, setTag] = React.useState("");
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    title: question?.title || "",
    content: question?.content || "",
    authorId: user?.$id || "",
    tags: new Set(question?.tags || []),
    attachment: null as File | null,
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const loadConfetti = (timeInMS = 3000) => {
    const end = Date.now() + timeInMS;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;
      Confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      Confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
      requestAnimationFrame(frame);
    };

    frame();
  };

  const create = async () => {
    let attachmentId = null;
    if (formData.attachment) {
      const storageResponse = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment
      );
      attachmentId = storageResponse.$id;
    }

    const response = await databases.createDocument(
      db,
      questionCollection,
      ID.unique(),
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId,
      }
    );

    loadConfetti();
    return response;
  };

  const update = async () => {
    if (!question) throw new Error("Please provide a question");

    let attachmentId = question.attachmentId || null;
    if (formData.attachment) {
      if (attachmentId) {
        await storage.deleteFile(
          questionAttachmentBucket,
          question.attachmentId!
        );
      }
      const file = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment
      );
      attachmentId = file.$id;
    }

    const response = await databases.updateDocument(
      db,
      questionCollection,
      question.$id,
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId,
      }
    );

    return response;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanContent = formData.content.replace(/<[^>]+>/g, "").trim();

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (!cleanContent || cleanContent.length < 20) {
      setError("Please provide at least 20 characters of content");
      return;
    }
    if (formData.tags.size === 0) {
      setError("Please add at least one tag");
      return;
    }
    if (!formData.authorId) {
      setError("You must be logged in to publish");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = question ? await update() : await create();
      router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      {error && (
        <LabelInputContainer>
          <div className="text-center">
            <span className="text-red-500">{error}</span>
          </div>
        </LabelInputContainer>
      )}

      <LabelInputContainer>
        <Label htmlFor="title">
          Title Address
          <br />
          <small>
            Be specific and imagine you&apos;re asking a question to another
            person.
          </small>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="content">
          What are the details of your problem?
          <br />
          <small>
            Introduce the problem and expand on what you put in the title.
            Minimum 20 characters.
          </small>
        </Label>
        <RTE
          value={formData.content}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, content: value || "" }))
          }
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="image">
          Image (optional)
          <br />
          <small>Add an image to make your question clearer.</small>
        </Label>
        <Input
          id="image"
          name="image"
          accept="image/*"
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            setFormData((prev) => ({
              ...prev,
              attachment: files[0],
            }));
          }}
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="tag">
          Tags
          <br />
          <small>
            Add tags to describe what your question is about. Start typing to
            see suggestions.
          </small>
        </Label>
        <div className="flex w-full gap-4">
          <div className="w-full">
            <Input
              id="tag"
              name="tag"
              placeholder="e.g. (java c objective-c)"
              type="text"
              value={tag}
              onChange={(e) => setTag(() => e.target.value)}
            />
          </div>
          <button
            className="relative shrink-0 rounded-full border border-slate-600 bg-slate-700 px-8 py-2 text-sm text-white transition duration-200 hover:shadow-2xl hover:shadow-white/[0.1]"
            type="button"
            onClick={() => {
              if (tag.length === 0) return;
              setFormData((prev) => ({
                ...prev,
                tags: new Set([...Array.from(prev.tags), tag]),
              }));
              setTag("");
            }}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from(formData.tags).map((tag, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="group relative inline-block rounded-full bg-slate-800 p-px text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900">
                <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10">
                  <span>{String(tag)}</span>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        tags: new Set(
                          Array.from(prev.tags).filter((t) => t !== tag)
                        ),
                      }))
                    }
                    type="button"
                  >
                    <IconX size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </LabelInputContainer>

      <button
        className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        type="submit"
        disabled={loading}
      >
        {question ? "Update" : "Publish"}
      </button>
    </form>
  );
};

export default QuestionForm;
