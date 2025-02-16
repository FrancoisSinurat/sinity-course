"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileHeader({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    learningPath: user.learningPath,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Simulasikan penyimpanan data
    console.log("Updated Profile:", formData);
    setIsEditing(false);
  };

  return (
    <Card className="mb-6 mt-8">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            {isEditing ? (
              <Input name="name" value={formData.name} onChange={handleChange} />
            ) : (
              formData.name
            )}
          </CardTitle>
          <span className="text-sm text-gray-600">
            {isEditing ? (
              <Input name="email" value={formData.email} onChange={handleChange} />
            ) : (
              formData.email
            )}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Learning Path:</strong>{" "}
          {isEditing ? (
            <Input name="learningPath" value={formData.learningPath} onChange={handleChange} />
          ) : (
            formData.learningPath
          )}
        </p>
        <div className="mt-4">
          {isEditing ? (
            <>
              <Button className="mr-2" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
