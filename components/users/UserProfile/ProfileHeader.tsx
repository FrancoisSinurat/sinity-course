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
    <Card className="relative mt-10 mx-auto max-w-2xl bg-white border border-gray-200 shadow-lg rounded-3xl p-12">
      <CardHeader className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-muted text-primary flex items-center justify-center text-4xl font-bold uppercase shadow">
          {user.name[0]}
        </div>

        {isEditing ? (
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nama"
            className="text-center text-xl font-semibold ring-1 ring-gray-300 focus:ring-primary transition"
          />
        ) : (
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            {formData.name}
          </CardTitle>
        )}

        <div className="text-center text-sm text-gray-500 w-full">
          {isEditing ? (
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="text-center ring-1 ring-gray-300 focus:ring-primary transition"
            />
          ) : (
            <p>{formData.email}</p>
          )}
        </div>
      </CardHeader>

      <CardContent className="mt-6 space-y-2 text-gray-700">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-500">Nama</span>
          <span className="font-semibold">{user.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-500">Email</span>
          <span className="font-semibold">{user.email}</span>
        </div>
      </CardContent>

      <div className="absolute bottom-4 right-4 flex gap-2 ">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-primary text-white rounded-xl px-4 shadow hover:bg-primary/90"
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
                setFormData({ name: user.name, email: user.email });
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
