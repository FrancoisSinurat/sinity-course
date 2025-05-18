"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X, Pencil, UserCircle2 } from "lucide-react";

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
    onSave({
      name: formData.name,
      email: formData.email,
    });
    setIsEditing(false);
  };

  return (
    <Card className="relative mb-10 mt-10 mx-auto max-w-xl shadow-2xl rounded-2xl p-6 pb-16">
      <CardHeader className="flex flex-col items-center gap-4">
        <UserCircle2 className="w-20 h-20 text-primary" />
        <CardTitle className="text-2xl font-bold text-center text-primary">
          {isEditing ? (
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama"
              className="text-center"
            />
          ) : (
            formData.name
          )}
        </CardTitle>
        <div className="text-center space-y-1 text-muted-foreground text-sm w-full ">
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
                placeholder="Kategori yang disukai"
                disabled
                className="bg-slate-200"
              />
            </>
          ) : (
            <>
              <p>{formData.email}</p>
              <p>Kategori: {formData.category_preference}</p>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="mt-6 space-y-4 text-sm text-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><span className="font-semibold">Username:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Kategori:</span> {user.category_preference ?? "-"}</p>
        </div>
      </CardContent>

      <div className="absolute bottom-4 right-4 flex gap-2">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 shadow-md transition-all"
          >
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>
        ) : (
          <>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 transition-all"
            >
              <Save className="w-4 h-4 mr-2" /> Simpan
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="hover:bg-gray-100 px-4 transition-all"
            >
              <X className="w-4 h-4 mr-2" /> Batal
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
