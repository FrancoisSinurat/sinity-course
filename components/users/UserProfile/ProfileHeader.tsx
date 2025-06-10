"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X, Pencil } from "lucide-react";
import { showSuccess, showError } from "@/lib/alert";


interface User {
  user_id: number;
  name: string;
  email: string;
  category_preference: string | null;
}

interface UserProps {
  user: User;
  onSave: (updatedData: { name: string; email: string }) => void;
}

export default function ProfileHeader({ user, onSave }: UserProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    category_preference: user.category_preference ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      showError("Format email tidak valid. Harap gunakan format email yang benar.");
      return;
    }

    onSave({
      name: formData.name,
      email: formData.email,
    });
    setIsEditing(false);
    showSuccess("Data diri berhasil diperbarui!");
  };


  return (
  <Card className="relative mb-10 mt-10 mx-auto max-w-xl shadow-xl rounded-3xl border border-gray-200 p-6 pt-10 bg-white">
    <CardHeader className="flex flex-col items-center gap-3">
      <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold">
        {user.name[0].toUpperCase()}
      </div>
      {isEditing ? (
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nama"
          className="text-center text-xl font-semibold"
        />
      ) : (
        <CardTitle className="text-xl font-semibold text-center text-primary">
          {formData.name}
        </CardTitle>
      )}
      <div className="text-center space-y-1 text-muted-foreground text-sm w-full">
        {isEditing ? (
          <>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <Input
              name="category_preference"
              value={formData.category_preference}
              placeholder="Learning Path"
              disabled
              className="bg-slate-100 text-center"
            />
          </>
        ) : (
          <>
            <p>{formData.email}</p>
            <p className="text-sm italic text-muted-foreground">Learning Path: {formData.category_preference}</p>
          </>
        )}
      </div>
    </CardHeader>

    <CardContent className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
      <p><span className="font-semibold">Nama:</span> {user.name}</p>
      <p><span className="font-semibold">Email:</span> {user.email}</p>
      <p><span className="font-semibold">Learning Path:</span> {user.category_preference ?? "-"}</p>
    </CardContent>

    <div className="absolute bottom-4 right-4 flex gap-2">
      {!isEditing ? (
        <Button
          onClick={() => setIsEditing(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl shadow"
        >
          <Pencil className="w-4 h-4 mr-2" /> Edit
        </Button>
      ) : (
        <>
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" /> Simpan
          </Button>
          <Button
          variant="outline"
          onClick={() => {
            setFormData({
              name: user.name,
              email: user.email,
              category_preference: user.category_preference ?? "",
            });
            setIsEditing(false);
          }}
          className="hover:bg-gray-100 px-4 rounded-xl"
        >
          <X className="w-4 h-4 mr-2" /> Batal
        </Button>

        </>
      )}
    </div>
  </Card>
  );
}