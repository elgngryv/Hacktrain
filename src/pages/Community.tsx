import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  HelpCircle, 
  Star, 
  Trophy,
  Clock,
  Heart,
  BookOpen,
  Lightbulb,
  UserCheck
} from 'lucide-react';

const Community = () => {
  const mentors = [
    {
      id: 1,
      name: 'Dr. Fidan Məmmədova',
      title: 'Senior Cybersecurity Consultant',
      expertise: ['Penetration Testing', 'SIEM', 'Incident Response'],
      rating: 4.9,
      students: 150,
      languages: ['Azərbaycan', 'English'],
      avatar: '/avatars/mentor1.jpg',
      online: true,
      experience: '15+ years'
    },
    {
      id: 2,
      name: 'Elnur Qasımov',
      title: 'Red Team Lead',
      expertise: ['Advanced Persistent Threats', 'Social Engineering', 'Web Exploitation'],
      rating: 4.8,
      students: 89,
      languages: ['Azərbaycan', 'Türk'],
      avatar: '/avatars/mentor2.jpg',
      online: false,
      experience: '10+ years'
    },
    {
      id: 3,
      name: 'Leyla Həsənova',
      title: 'Digital Forensics Expert',
      expertise: ['Memory Analysis', 'Mobile Forensics', 'Malware Analysis'],
      rating: 4.9,
      students: 76,
      languages: ['Azərbaycan', 'Russian'],
      avatar: '/avatars/mentor3.jpg',
      online: true,
      experience: '12+ years'
    }
  ];

  const discussions = [
    {
      id: 1,
      title: 'SQL injection-dan necə qorunmaq olar?',
      author: 'cyber_beginner',
      category: 'Web Security',
      replies: 23,
      views: 456,
      lastActivity: '2 saat əvvəl',
      tags: ['SQL', 'Web', 'Defense'],
      solved: true,
      hot: true
    },
    {
      id: 2,
      title: 'SIEM sistemlərində log analizi',
      author: 'security_analyst',
      category: 'Blue Team',
      replies: 15,
      views: 234,
      lastActivity: '4 saat əvvəl',
      tags: ['SIEM', 'Logs', 'Analysis'],
      solved: false,
      hot: false
    },
    {
      id: 3,
      title: 'Malware reverse engineering üçün toollar',
      author: 'malware_hunter',
      category: 'Reverse Engineering',
      replies: 31,
      views: 789,
      lastActivity: '1 gün əvvəl',
      tags: ['Malware', 'Tools', 'Reverse'],
      solved: true,
      hot: true
    },
    {
      id: 4,
      title: 'CTF yarışlarına necə hazırlaşmaq?',
      author: 'ctf_newbie',
      category: 'General',
      replies: 42,
      views: 1234,
      lastActivity: '2 gün əvvəl',
      tags: ['CTF', 'Training', 'Tips'],
      solved: false,
      hot: false
    }
  ];

  const achievements = [
    { icon: Trophy, title: 'Ən yaxşı təlimçi', count: 3 },
    { icon: Heart, title: 'İcma köməkçisi', count: 47 },
    { icon: BookOpen, title: 'Bilik paylaşan', count: 156 },
    { icon: Lightbulb, title: 'Tapşırıq həllçisi', count: 89 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Users className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">
          <span className="cyber-glow-text">Mentorlar və Tələbələr</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Mentorlarla öyrənin və aktiv kibertəhlükəsizlik icmasına qoşulun.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {achievements.map((achievement, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <achievement.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{achievement.count}</div>
              <div className="text-sm text-muted-foreground">{achievement.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - Discussions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">İcma Müzakirələri</h2>
            <Button className="cyber-button-hero">
              <MessageCircle className="mr-2 h-4 w-4" />
              Yeni Mövzu
            </Button>
          </div>

          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className="cyber-card hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {discussion.hot && (
                        <Badge variant="destructive" className="text-xs">
                          Populyar
                        </Badge>
                      )}
                      {discussion.solved && (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                          Həll Olundu
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {discussion.category}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{discussion.lastActivity}</span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer transition-colors">
                    {discussion.title}
                  </h3>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span>by {discussion.author}</span>
                    <span className="flex items-center">
                      <MessageCircle className="mr-1 h-3 w-3" />
                      {discussion.replies} şərhlər
                    </span>
                    <span>{discussion.views} baxış sayı</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {discussion.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline">Daha çox müzakirə göstər</Button>
          </div>
        </div>

        {/* Sidebar - Mentors */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Peşəkar təlimçilər</h2>
            <Button variant="outline" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Təlimçiyə müraciət et
            </Button>
          </div>

          <div className="space-y-4">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="cyber-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {mentor.online && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm truncate">{mentor.name}</h3>
                        <UserCheck className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">{mentor.title}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">{mentor.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({mentor.students} students)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Təcrübə sahəsi:</div>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 2).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {mentor.expertise.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{mentor.expertise.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Dillər:</div>
                      <div className="text-xs">{mentor.languages.join(', ')}</div>
                    </div>

                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Təcrübə:</div>
                      <div className="text-xs">{mentor.experience}</div>
                    </div>

                    <Button size="sm" className="w-full" variant="outline">
                      <MessageCircle className="mr-2 h-3 w-3" />
                      Təlimçiyə müraciət et
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Guidelines */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">İcma Qaydaları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Hörməti saxla, peşəkar ol</div>
              <div>• Digər öyrənənlərə dəstək ol</div>
              <div>• Öz biliklərini paylaşmaqdan çəkinmə</div>
              <div>• Etik hacking prinsiplərinə əməl et</div>
              <div>• Hörmətli və uyğun ifadələrdən istifadə et</div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Son fəaliyyətlər
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span><strong>cyber_ninja</strong> "SQL Injection Basics" tapşırığını tamamladı.</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                <span><strong>Dr. Aysel</strong> Web Security sualını cavablandırdı</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                <span><strong>red_team_pro</strong> Hücum vs Müdafiə arenada qazandı</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;
