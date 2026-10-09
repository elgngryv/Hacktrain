import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Flag, 
  Globe, 
  Cpu, 
  Lock, 
  Eye, 
  Smartphone,
  Star,
  Clock,
  Users,
  Filter
} from 'lucide-react';

const Challenges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hamısı');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Hamısı');

  const categories = [
    { id: 'Hamısı', name: 'Bütün kateqoriyalar', icon: Flag },
    { id: 'Web', name: 'Web Exploitation', icon: Globe },
    { id: 'Crypto', name: 'Cryptography', icon: Lock },
    { id: 'Reverse', name: 'Reverse Engineering', icon: Cpu },
    { id: 'Forensics', name: 'Digital Forensics', icon: Eye },
    { id: 'Mobile', name: 'Mobile Security', icon: Smartphone },
  ];

  const challenges = [
    {
      id: 1,
      title: 'SQL Injection Əsasları',
      description: 'SQL injection hücumlarının əsaslarını və zəif veb tətbiqlərdən necə istifadə ediləcəyini öyrənin.',
      category: 'Web',
      difficulty: 'Asan',
      points: 50,
      solves: 1240,
      rating: 4.5,
      tags: ['SQL', 'Veb', 'Verilənlər Bazasası'],
      author: 'cyber_mentor',
      time: '30 dəqiqə'
    },
    {
      id: 2,
      title: 'Caesar Şifrəsi Sındırmaq',
      description: 'Caesar şifrəsi ilə kodlanmış mesajı tezlik analizindən istifadə edərək deşifrə edin.',
      category: 'Crypto',
      difficulty: 'Asan',
      points: 25,
      solves: 2100,
      rating: 4.2,
      tags: ['Şifrə', 'Klassik', 'Tezlik'],
      author: 'crypto_king',
      time: '15 dəqiqə'
    },
    {
      id: 3,
      title: 'İkili Analiz',
      description: 'Linux ikili faylını təhlil edərək gizli flaqları tapın və funksionallığını anlayın.',
      category: 'Reverse',
      difficulty: 'Orta',
      points: 100,
      solves: 456,
      rating: 4.7,
      tags: ['İkili', 'Linux', 'Assembly'],
      author: 'rev_master',
      time: '1 saat'
    },
    {
      id: 4,
      title: 'Yaddaş Forensikası',
      description: 'Yaddaş dumpını analiz edərək itmiş faylları tapın və zərərli proqramları aşkarlayın.',
      category: 'Forensics',
      difficulty: 'Çətin',
      points: 200,
      solves: 89,
      rating: 4.9,
      tags: ['Yaddaş', 'Volatility', 'Zərərli proqram'],
      author: 'forensics_pro',
      time: '2 saat'
    },
    {
      id: 5,
      title: 'Android Tətbiq Təhlükəsizliyi',
      description: 'Android tətbiqində zəiflikləri tapın və icazəsiz giriş əldə edin.',
      category: 'Mobile',
      difficulty: 'Orta',
      points: 150,
      solves: 234,
      rating: 4.4,
      tags: ['Android', 'APK', 'Mobil'],
      author: 'mobile_hacker',
      time: '45 dəqiqə'
    },
    {
      id: 6,
      title: 'Təkmil XSS',
      description: 'Müasir veb tətbiqlərdə mürəkkəb XSS zəifliklərini CSP bypass ilə istifadə edin.',
      category: 'Web',
      difficulty: 'Çətin',
      points: 300,
      solves: 67,
      rating: 4.8,
      tags: ['XSS', 'CSP', 'JavaScript'],
      author: 'web_ninja',
      time: '3 saat'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Asan': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Orta': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Çətin': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Flag;
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Hamısı' || challenge.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'Hamısı' || challenge.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Flag className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">
          <span className="cyber-glow-text">CTF Tapşırıqları</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Kiber təhlükəsizlik bacarıqlarınızı müxtəlif sahələrdə praktiki tapşırıqlarla sınayın
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-6 mb-8">
        <div className="grid lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tapşırıqları axtar…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Kateqoriya</label>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 4).map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center"
                >
                  <category.icon className="mr-1 h-3 w-3" />
                  {category.id}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Çətinlik</label>
            <div className="flex flex-wrap gap-2">
              {['Hamısı', 'Asan', 'Orta', 'Çətin'].map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={difficulty !== 'Hamısı' ? getDifficultyColor(difficulty) : ''}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tapılanlar</label>
            <div className="text-sm text-muted-foreground">
              <div>Cəmi: {challenges.length} tapşırıq</div>
              <div>Filtrə edilmiş: {filteredChallenges.length} nəticə</div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="cyber-grid">
        {filteredChallenges.map((challenge) => {
          const CategoryIcon = getCategoryIcon(challenge.category);
          
          return (
            <Card key={challenge.id} className="cyber-card-glow group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CategoryIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{challenge.points}pts</div>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {challenge.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {challenge.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {challenge.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="mr-1 h-3 w-3" />
                      {challenge.solves} həll
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {challenge.time}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Star className="mr-1 h-3 w-3" />
                      {challenge.rating}/5
                    </div>
                  </div>

                  {/* Author */}
                  <div className="text-sm text-muted-foreground">
                    Hazırlayan: <span className="text-primary font-medium">{challenge.author}</span>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full cyber-button-hero"
                    onClick={() => window.location.href = `/challenge/${challenge.id}`}
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Tapşırığa Başla
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Heç bir tapşırıq tapılmadı</h3>
          <p className="text-muted-foreground">Axtarış meyarlarınızı və ya filterləri dəyişməyə çalışın</p>
        </div>
      )}

      {/* Categories Overview */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          <span className="cyber-glow-text">Tapşırıq kateqoriyaları</span>
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(1).map((category) => (
            <Card key={category.id} className="text-center p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
              <category.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-muted-foreground">
                {challenges.filter(c => c.category === category.id).length} tapşırıq
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Challenges;