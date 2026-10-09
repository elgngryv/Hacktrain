import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Medal, 
  Star, 
  Target, 
  Zap, 
  Shield,
  Sword,
  Crown,
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('overall');

  const topPlayers = [
    {
      rank: 1,
      name: 'CyberAz_Master',
      avatar: '/avatars/player1.jpg',
      points: 15420,
      level: 47,
      badge: 'Ustadlar ustadı',
      streak: 45,
      challenges: 234,
      battles: 89,
      winRate: 94,
      country: 'AZ',
      lastActive: 'Onlayn'
    },
    {
      rank: 2,
      name: 'RedTeam_Ninja',
      avatar: '/avatars/player2.jpg',
      points: 14850,
      level: 44,
      badge: 'Elit Hacker',
      streak: 32,
      challenges: 198,
      battles: 76,
      winRate: 91,
      country: 'TR',
      lastActive: '2 saat əvvəl'
    },
    {
      rank: 3,
      name: 'BlueDefender',
      avatar: '/avatars/player3.jpg',
      points: 13990,
      level: 42,
      badge: 'Müdafiə Eksperti',
      streak: 28,
      challenges: 187,
      battles: 82,
      winRate: 89,
      country: 'AZ',
      lastActive: '1 saat əvvəl'
    }
  ];

  const leaderboardData = [
    ...topPlayers,
    {
      rank: 4,
      name: 'CryptoKing_AZ',
      avatar: '/avatars/player4.jpg',
      points: 12760,
      level: 39,
      badge: 'Crypto Master',
      streak: 21,
      challenges: 165,
      battles: 45,
      winRate: 87,
      country: 'AZ',
      lastActive: '3 saat əvvəl'
    },
    {
      rank: 5,
      name: 'WebExploit_Pro',
      avatar: '/avatars/player5.jpg',
      points: 11890,
      level: 37,
      badge: 'Web Warrior',
      streak: 18,
      challenges: 142,
      battles: 67,
      winRate: 85,
      country: 'RU',
      lastActive: '5 saat əvvəl'
    },
    {
      rank: 6,
      name: 'ForensicsGuru',
      avatar: '/avatars/player6.jpg',
      points: 10950,
      level: 34,
      badge: 'Digital Detective',
      streak: 15,
      challenges: 128,
      battles: 34,
      winRate: 83,
      country: 'AZ',
      lastActive: '1 gün əvvəl'
    }
  ];

  const badges = [
    {
      name: 'İlk Qalib',
      description: 'Yeni çətinliyi ilk sənin fəth etməyin gözlənilir!',
      icon: Zap,
      rarity: 'Əfsanəvi',
      holders: 12,
      color: 'text-yellow-400'
    },
    {
      name: 'Firewall Ustası',
      description: 'Müdafiə Komandası ilə 50 döyüş qazan',
      icon: Shield,
      rarity: 'Epik',
      holders: 45,
      color: 'text-blue-400'
    },
    {
      name: 'CTF Çempion',
      description: 'Aylıq CTF-də zirvəyə qalx və top 3-ə daxil ol!',
      icon: Trophy,
      rarity: 'Əfsanəvi',
      holders: 8,
      color: 'text-purple-400'
    },
    {
      name: 'Qırmızı Fırtına',
      description: 'Hücum Komandası ilə 100 döyüşü fəth et!',
      icon: Sword,
      rarity: 'Epik',
      holders: 23,
      color: 'text-red-400'
    },
    {
      name: 'Sürətli qəhrəman',
      description: 'Tapşırığı 5 dəqiqədən az vaxtda tamamladı',
      icon: Zap,
      rarity: 'Nadir',
      holders: 156,
      color: 'text-green-400'
    },
    {
      name: 'Seriya Qalibi',
      description: '30 gün ardıcıl tapşırıqları həll et və Seriya Qalibi ol!',
      icon: TrendingUp,
      rarity: 'Epik',
      holders: 67,
      color: 'text-orange-400'
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Əfsanəvi': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Epik': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Nadir': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">
          <span className="cyber-glow-text">Liderlər Cədvəli</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          HackTrain icmasında ön sıralarda olan kibertəhlükəsizlik qəhrəmanları
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-card rounded-lg p-1 flex space-x-1">
          {[
            { id: 'overall', label: 'Ümumi', icon: Trophy },
            { id: 'monthly', label: 'Bu Ay', icon: Calendar },
            { id: 'battles', label: 'Mübarizələr', icon: Sword }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center"
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {topPlayers.map((player, index) => (
              <Card 
                key={player.rank} 
                className={`cyber-card-glow ${player.rank === 1 ? 'ring-2 ring-yellow-400/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5' : ''}`}
              >
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-3">
                    {getRankIcon(player.rank)}
                  </div>
                  <Avatar className="h-16 w-16 mx-auto mb-3">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{player.name}</CardTitle>
                  <Badge variant="outline" className="mx-auto">
                    {player.badge}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="text-2xl font-bold cyber-glow-text">
                    {player.points.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">xal</div>
                  <div className="text-sm">
                    Level {player.level} • {player.country}
                  </div>
                  <Progress value={(player.level % 10) * 10} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Qlobal Sıralama
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((player) => (
                  <div 
                    key={player.rank} 
                    className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(player.rank)}
                    </div>

                    <Avatar className="h-10 w-10">
                      <AvatarImage src={player.avatar} alt={player.name} />
                      <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold truncate">{player.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {player.country}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Level {player.level} • {player.badge}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-primary">
                        {player.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {player.winRate}% uğur faizi
                      </div>
                    </div>

                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium">
                        {player.challenges} tapşırıq
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {player.battles} mübarizə
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground hidden md:block">
                      {player.lastActive}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Rank */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Cari Sıralaman</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className="text-3xl font-bold cyber-glow-text">#42</div>
                <div className="text-lg font-semibold">user_hacker</div>
                <div className="text-muted-foreground">8,450 xal</div>
                <Badge variant="outline">Orta dərəcə</Badge>
                <div className="text-sm text-muted-foreground">
                  Sonrakı sıraya çatmaq üçün 38 xal toplamalısan
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">İcma Göstəriciləri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bütün İştirakçılar</span>
                <span className="font-semibold">2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Həftəlik aktivlik</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bitmiş tapşırıqlar</span>
                <span className="font-semibold">15,678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mübarizələr</span>
                <span className="font-semibold">3,456</span>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Badges */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Uğur Medalları</CardTitle>
              <CardDescription>İcmanın seçilmiş nailiyyətləri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30">
                    <div className={`p-2 bg-secondary/50 rounded-lg ${badge.color}`}>
                      <badge.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm truncate">{badge.name}</h4>
                        <Badge variant="outline" className={`text-xs ${getBadgeRarityColor(badge.rarity)}`}>
                          {badge.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {badge.holders} nəfər əldə edib
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
