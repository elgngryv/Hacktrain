import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://hacktrain.onrender.com/api/info/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP xətası! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.user) {
          setUser(data.user);
        } else {
          throw new Error("API cavabı gözlənilən formatda deyil.");
        }
      } catch (e) {
        console.error("İstifadəçi məlumatlarını gətirmək alınmadı:", e);
        setError("İstifadəçi məlumatlarını yükləmək mümkün olmadı.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    } else {
      setLoading(false);
      setError("İstifadəçi ID-si tapılmadı.");
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-400">Məlumatlar yüklənir...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen text-gray-400">İstifadəçi tapılmadı.</div>;
  }

  // Tarixləri daha sadə formata çevirir (yalnız tarix, vaxt yox)
  const formattedCreatedAt = new Date(user.createdAt).toLocaleDateString();
  const formattedUpdatedAt = new Date(user.updatedAt).toLocaleDateString();

  // Çətinliklər üzrə məlumatları tapmaq üçün köməkçi funksiya
  const getChallengeScore = (level) => {
    const challenge = user.challenges.find(c => c.level === level);
    return challenge ? challenge.score : 0;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#19191C] w-full p-4">
      <Card className="w-full max-w-2xl pt-10 pb-20">
        <CardHeader className="flex flex-col items-center justify-center">
          <div className="relative w-28 h-28 mb-4">
            <Avatar className="w-28 h-28">
              <AvatarImage src={`https://avatar.iran.liara.run/username?username=${user.username}`} alt={`${user.username} avatarı`} />
              <AvatarFallback><User className="w-16 h-16" /></AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl font-bold">{user.username}</CardTitle>
          <div className="flex justify-center space-x-2 mt-2">
            <Badge>{user.role}</Badge>
            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">İstifadəçi Adı</Label>
              <Input id="username" value={user.username} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-poçt ünvanı</Label>
              <Input id="email" type="email" value={user.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createdAt">Qeydiyyat tarixi</Label>
              <Input id="createdAt" value={formattedCreatedAt} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="updatedAt">Son yenilənmə tarixi</Label>
              <Input id="updatedAt" value={formattedUpdatedAt} readOnly />
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Çətinliklər üzrə nəticələr</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="easy-score">Asan inputda say</Label>
                <Input id="easy-score" value={getChallengeScore('easy')} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="normal-score">Orta inputda say</Label>
                <Input id="normal-score" value={getChallengeScore('normal')} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hard-score">Çətin inputda say</Label>
                <Input id="hard-score" value={getChallengeScore('hard')} readOnly />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;