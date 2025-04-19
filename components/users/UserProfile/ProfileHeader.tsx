"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export default function ProfileHeader({ user }: UserProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
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
            <CardHeader>
                <CardTitle className="text-xl">
                    {isEditing ? (
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nama"
                        />
                    ) : (
                        formData.name
                    )}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                    {isEditing ? (
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                    ) : (
                        formData.email
                    )}
                </p>
            </CardHeader>
            <CardContent className="space-y-2">
                <p>
                    <strong>User ID:</strong> {user.id}
                </p>
                <p>
                    <strong>User Name:</strong> {user.name}
                </p>
                <p>
                    <strong>User Email:</strong> {user.email}
                </p>
                <div className="mt-4">
                    {isEditing ? (
                        <>
                            <Button className="mr-2" onClick={handleSave}>
                                Simpan
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Batal
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
