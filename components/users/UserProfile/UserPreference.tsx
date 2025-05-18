import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function UserPreference(){
    return(
        <div className="mb-4">
        <Card className="w-full max-w-sm p-2 shadow-lg">
            <CardHeader className="flex flex-row items-center gap-3">
                <Briefcase className="w-6 h-8 text-red-600" />
                <CardTitle className="text-center">User Preference</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-gray-600">
                    Lengkapi profil berdasarkan keahlian Anda untuk mendapatkan rekomendasi kursus yang lebih relevan.
                </div>
                <div className="mt-4">
                    <Button asChild className="w-full bg-red-600 text-white hover:bg-red-700">
                        <Link href="/user-pref">Ambil Perjalanan Anda</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
    );
}