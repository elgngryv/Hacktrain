import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Flag, 
  Globe, 
  Cpu, 
  Lock, 
  Eye, 
  Smartphone,
  Star,
  Clock,
  Users,
  Download,
  Play
} from 'lucide-react';

const API_URL = "https://ctf1-7ywm.onrender.com/"; // CTF serverinin URL-i ilə dəyişdirin

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock challenge data - in real app, fetch by ID
  const challenges = [
    {
      id: 1,
      title: 'SQL Injection Əsasları',
      description: 'SQL injection hücumlarının əsaslarını və zəif veb tətbiqlərdən necə istifadə ediləcəyini öyrənin.',
      longDescription: `Bu tapşırıq sizə SQL injection zəifliklərinin əsaslarını öyrədir. Siz zəif parametrləri necə müəyyən edəcəyinizi, zərərli yükləri necə hazırlayacağınızı və verilənlər bazasından həssas məlumatları necə çıxaracağınızı öyrənəcəksiniz.

**Nələr öyrənəcəksiniz:**
- SQL injection zəifliklərini necə müəyyən etmək olar
- Əsas SQL injection texnikaları
- Union-based SQL injection
- Kor SQL injection (Blind SQLi) əsasları
- Verilənlər bazası məlumatlarını necə çıxarmaq olar

**Tapşırıq Mühiti:**
Siz bir neçə SQL injection zəifliyi olan simulyasiya edilmiş bir e-ticarət veb-saytı ilə işləyəcəksiniz. Məqsədiniz, verilənlər bazasından gizli flaqı çıxarmaq üçün bu zəifliklərdən istifadə etməkdir.`,
      category: 'Web',
      difficulty: 'Asan',
      points: 50,
      solves: 1240,
      rating: 4.5,
      tags: ['SQL', 'Veb', 'Verilənlər Bazasası', 'Blind SQLi'],
      author: 'cyber_mentor',
      time: '30 dəq',
      files: ['challange1.pdf'],
      hints: [
        'Verilənlər bazası ilə qarşılıqlı əlaqədə olan giriş sahələrini axtarmağa çalışın',
        'Xəta mesajları faydalı məlumatları ortaya çıxara bilər',
        '`category` parametrini `http://targeturl/products?category=` sorğusu ilə yoxlayın',
        'Blind SQL Injection hücumu üçün Python-da `substring` və `length` funksiyalarından istifadə etməlisiniz.',
        'Diqqətli olun! `eval()` funksiyası çox təhlükəlidir və birbaşa Python kodunu işlədə bilər.'
      ]
    }
  ];

  const challenge = challenges.find(c => c.id === parseInt(id || '1')) || challenges[0];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Asan': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Orta': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Çətin': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web': Globe,
      'Crypto': Lock,
      'Reverse': Cpu,
      'Forensics': Eye,
      'Mobile': Smartphone
    };
    return icons[category] || Flag;
  };

  const CategoryIcon = getCategoryIcon(challenge.category);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/challenges')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Tapşırıqlara Qayıt
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challenge Header */}
          <Card className="cyber-card-glow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <CategoryIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">{challenge.title}</CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <div className="text-lg font-bold text-primary">{challenge.points} xal</div>
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-base mt-4">
                {challenge.description}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Challenge Description */}
          <Card>
            <CardHeader>
              <CardTitle>Tapşırıq Təsviri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line">{challenge.longDescription}</div>
              </div>
            </CardContent>
          </Card>

          {/* Files and Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Fayllar və Resurslar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {challenge.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span>{file}</span>
                    </div>
                    {/* Faylın adı challange.pdf olarsa, onu public qovluğundan yükləyin */}
                    {file === 'challange1.pdf' ? (
                      <a href={`/${file}`} download>
                        <Button size="sm" variant="outline">
                          Yüklə
                        </Button>
                      </a>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Yüklə
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Challenge Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Tapşırıq Statistikası</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  Həll edənlər
                </div>
                <span className="font-medium">{challenge.solves}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  Təqribi Vaxt
                </div>
                <span className="font-medium">{challenge.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Star className="mr-2 h-4 w-4" />
                  Reytinq
                </div>
                <span className="font-medium">{challenge.rating}/5</span>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground">
                Hazırlayan: <span className="text-primary font-medium">{challenge.author}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Teqlər</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {challenge.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hints */}
          <Card>
            <CardHeader>
              <CardTitle>İpucular</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {challenge.hints.map((hint, index) => (
                <div key={index} className="p-3 bg-secondary/20 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium text-primary">İpucu {index + 1}:</span> {hint}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Start Challenge Button */}
          <Button 
            className="w-full cyber-button-hero"
            onClick={() => navigate(`/challenge/${challenge.id}/workspace`)}
          >
            <Play className="mr-2 h-4 w-4" />
            Tapşırığa Başla
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
