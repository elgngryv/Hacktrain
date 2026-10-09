import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://hacktrain.onrender.com/api/users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          throw new Error("API cavabı gözlənilən `users` massiv formatında deyil.");
        }

      } catch (e) {
        console.error("İstifadəçiləri gətirmək alınmadı:", e);
        setError("İstifadəçiləri yükləmək alınmadı. Zəhmət olmasa, API serverini və cavab formatını yoxlayın.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    console.log(`ID-si: ${userId} olan istifadəçini silməyə cəhd edilir`);
    try {
      const response = await fetch(`https://hacktrain.onrender.com/api/delete/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`İstifadəçini silmək alınmadı: ${response.status}`);
      }
      
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      console.log(`ID-si ${userId} olan istifadəçi uğurla silindi.`);
    } catch (error) {
      console.error("İstifadəçini silərkən xəta:", error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role?.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return "destructive";
      case "moderator": return "secondary";
      default: return "outline";
    }
  };

  const getStatusBadgeColor = (status) => {
    return status?.toLowerCase() === "active" 
      ? "bg-green-500 text-white hover:bg-green-600" 
      : "bg-red-500 text-white hover:bg-red-600";
  };
  
  const getChallengeBadgeColor = (level) => {
    switch(level?.toLowerCase()) {
      case "easy": return "bg-blue-500 text-white hover:bg-blue-600";
      case "normal": return "bg-green-500 text-white hover:bg-green-600";
      case "hard": return "bg-red-500 text-white hover:bg-red-600";
      default: return "outline";
    }
  };

  const formatChallenges = (challenges) => {
    if (!challenges || !Array.isArray(challenges)) {
      return <Badge variant="outline">Məlumat yoxdur</Badge>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {challenges.map((c, index) => (
          <Badge key={index} className={`p-1 px-2 rounded-full ${getChallengeBadgeColor(c.level)}`}>
            {c.level.toUpperCase()}: {c.score}
          </Badge>
        ))}
      </div>
    );
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return "Məlumat yoxdur";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Yanlış tarix";
    }
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="p-6 text-center">İstifadəçilər yüklənir...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-destructive">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">İstifadəçi İdarəetmə</h1>
          <p className="text-muted-foreground">İstifadəçiləri, rolları və icazələri idarə edin</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              İstifadəçi Əlavə Et
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni İstifadəçi Əlavə Et</DialogTitle>
              <DialogDescription>Yeni bir istifadəçi hesabı yaradın</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Tam Adı</Label>
                <Input id="name" placeholder="Tam adınızı daxil edin" />
              </div>
              <div>
                <Label htmlFor="email">E-poçt</Label>
                <Input id="email" type="email" placeholder="E-poçt ünvanınızı daxil edin" />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">İstifadəçi</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">İstifadəçi Yarat</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Statistika Kartları */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-sm text-muted-foreground">Ümumi İstifadəçilər</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{users.filter(u => u.status?.toLowerCase() === "active").length}</div>
            <p className="text-sm text-muted-foreground">Aktiv İstifadəçilər</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{users.filter(u => u.status?.toLowerCase() !== "active").length}</div>
            <p className="text-sm text-muted-foreground">Passiv İstifadəçilər</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{users.filter(u => u.role?.toLowerCase() === "admin").length}</div>
            <p className="text-sm text-muted-foreground">Adminlər</p>
          </CardContent>
        </Card>
      </div>
      {/* Axtarış və Filtirlər */}
      <Card>
        <CardHeader>
          <CardTitle>İstifadəçi Kataloqu</CardTitle>
          <CardDescription>Bütün istifadəçiləri axtar və filtrlə</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="İstifadəçiləri axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün rollar</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">İstifadəçi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* İstifadəçilər Cədvəli */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>E-poçt</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Qeydiyyat Tarixi</TableHead>
                <TableHead>Həll edildi</TableHead>
                <TableHead className="text-right">Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://avatar.iran.liara.run/username?username=${user.username}`}
                        alt={`${user.username} avatarı`}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(user.status)}>
                      {user.status?.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatJoinDate(user.createdAt)}</TableCell>
                  <TableCell>
                    {formatChallenges(user.challenges)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Redaktə et
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user._id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;