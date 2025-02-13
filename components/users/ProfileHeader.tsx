import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfileHeader({ user }: { user: any }) {
  return (
    <Card className="mb-6 mt-8">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.name}</CardTitle>
          <span className="text-sm text-gray-600">{user.email}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Learning Path:</strong> {user.learningPath}</p>
        <Button asChild className="mt-4">
          <Link href="/edit-profile">Edit Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
