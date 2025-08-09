"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { account } from "@/models/client/config";
import { useRouter } from "next/navigation";

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
 
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  
  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingName(true);
      await account.updateName(name);
      alert("Name updated successfully!");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Error updating name");
    } finally {
      setLoadingName(false);
    }
  };


  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingPass(true);
      await account.updatePassword(newPassword, oldPassword);
      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      alert(err.message || "Error updating password");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="container mx-auto max-w-xl py-20">
      <h1 className="mb-8 text-3xl font-bold">Edit Profile</h1>

      
      <form
        onSubmit={handleNameChange}
        className="mb-10 rounded-lg border p-6 shadow"
      >
        <h2 className="mb-4 text-xl font-semibold">Change Name</h2>
        <Label htmlFor="name">New Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your new name"
          className="mt-2"
        />
        <Button
          type="submit"
          className="mt-4"
          disabled={!name || loadingName}
        >
          {loadingName ? "Saving..." : "Save Name"}
        </Button>
      </form>
      <form
        onSubmit={handlePasswordChange}
        className="rounded-lg border p-6 shadow"
      >
        <h2 className="mb-4 text-xl font-semibold">Change Password</h2>
        <Label htmlFor="oldPassword">Old Password</Label>
        <Input
          id="oldPassword"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Enter your old password"
          className="mt-2"
        />
        <Label htmlFor="newPassword" className="mt-4 block">
          New Password
        </Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          className="mt-2"
        />
        <Button
          type="submit"
          className="mt-4"
          disabled={!oldPassword || !newPassword || loadingPass}
        >
          {loadingPass ? "Updating..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
}
