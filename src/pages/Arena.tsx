import React, { useState, useRef, useEffect } from 'react';
import { 
  Sword, 
  Shield, 
  Target, 
  AlertTriangle, 
  Activity, 
  Clock,
  Users,
  Trophy,
  Zap,
  Eye,
  Terminal,
  Flame
} from 'lucide-react';
import { gsap } from 'gsap';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Arena = () => {
  const [activeTeam, setActiveTeam] = useState(null);
  const [battleInProgress, setBattleInProgress] = useState(false);
  
  // Refs for GSAP animations
  const headerRef = useRef(null);
  const redCardRef = useRef(null);
  const blueCardRef = useRef(null);
  const battleStatusRef = useRef(null);
  const redScoreRef = useRef(null);
  const blueScoreRef = useRef(null);
  const quickStatsRef = useRef([]);

  const redTeamMissions = [
    { id: 1, name: 'Web Application Breach', difficulty: 'Orta', progress: 75, status: 'Davam edir' },
    { id: 2, name: 'Network Reconnaissance', difficulty: 'Asan', progress: 100, status: 'Tamamlandı' },
    { id: 3, name: 'Privilege Escalation', difficulty: 'Çətin', progress: 30, status: 'Davam edir' },
  ];

  const blueTeamAlerts = [
    { id: 1, type: 'Yüksək', message: 'Şübhəli SQL injection cəhdləri aşkarlandı', time: '2 dəqiqə əvvəl' },
    { id: 2, type: 'Orta', message: '192.168.1.100/arena IP-dən bir neçə uğursuz giriş cəhdi qeydə alındı', time: '5 dəqiqə əvvəl' },
    { id: 3, type: 'Aşağı', message: 'Şəbəkədə anormal trafik nümunəsi qeydə alındı', time: '8 dəqiqə əvvəl' },
  ];

  const joinTeam = (team) => {
    // Animate out the team selection cards
    const tl = gsap.timeline({ onComplete: () => {
      setActiveTeam(team);
      setBattleInProgress(true);
    }});
    tl.to([redCardRef.current, blueCardRef.current], { 
      opacity: 0, 
      y: 50, 
      duration: 0.5, 
      stagger: 0.2,
      ease: 'power2.in'
    });
  };

  const leaveBattle = () => {
    setActiveTeam(null);
    setBattleInProgress(false);
  };

  // GSAP animation logic
  useEffect(() => {
    // Initial intro animation
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out'
    });

    if (!battleInProgress) {
      // Team selection card animations
      gsap.fromTo(redCardRef.current, { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 });
      gsap.fromTo(blueCardRef.current, { x: 200, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 });
      
      // Animate quick stats numbers
      quickStatsRef.current.forEach((ref) => {
        if (ref) {
          const targetValue = parseFloat(ref.textContent.replace(/[^0-9.]/g, ''));
          const isDecimal = ref.textContent.includes('%');
          const isThousands = ref.textContent.includes(',');

          const startVal = { value: 0 };
          gsap.to(startVal, {
            value: targetValue,
            duration: 1.5,
            delay: 1.5,
            ease: "power2.out",
            onUpdate: () => {
              let displayValue = String(Math.round(startVal.value));
              if (isThousands) {
                displayValue = Math.round(startVal.value).toLocaleString('en-US');
              }
              if (isDecimal) {
                displayValue = `${Math.round(startVal.value)}%`;
              }
              ref.textContent = displayValue;
            }
          });
        }
      });
    } else {
      // Battle interface animations
      gsap.fromTo(battleStatusRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' });
      
      // Animate scores
      const redScore = { value: 0 };
      gsap.to(redScore, {
        value: 85,
        duration: 1.5,
        delay: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          redScoreRef.current.textContent = Math.round(redScore.value);
        }
      });

      const blueScore = { value: 0 };
      gsap.to(blueScore, {
        value: 72,
        duration: 1.5,
        delay: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          blueScoreRef.current.textContent = Math.round(blueScore.value);
        }
      });
    }
  }, [battleInProgress]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div ref={headerRef} className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center">
            <Shield className="h-12 w-12 text-blue-400 absolute -rotate-35 ml-6" />
            <Sword className="h-12 w-12 text-red-400 rotate-90 mr-10" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 mt-10">
          <span className="cyber-glow-text">Hücum vs Müdafiə Arenası</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Canlı kibertəhlükəsizlik qarşılaşmaları: Hücum et və ya Müdafiə et.
        </p>
      </div>

      {!battleInProgress ? (
        // Team Selection
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Red Team */}
          <Card ref={redCardRef} className="arena-red border-2 group hover:border-red-400 transition-all">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-500/20 rounded-full">
                  <Sword className="h-12 w-12 text-red-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-red-400">Hücum Komandası</CardTitle>
              <CardDescription>
                Zəiflikləri aşkarlayan və istismar edən hücum komandası
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-red-300">Sənin Vəzifən:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Penetrasiya testi və zəifliklərin qiymətləndirilməsi</li>
                  <li>• Veb tətbiqlərin istismarı</li>
                  <li>• Şəbəkəyə giriş və lateral hərəkət</li>
                  <li>• Sosial mühəndislik hücumları</li>
                </ul>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Hazırkı Hücumçular:</span>
                <Badge variant="destructive">12 Aktiv</Badge>
              </div>
              <Button 
                className="w-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                onClick={() => joinTeam('red')}
              >
                <Flame className="mr-2 h-4 w-4" />
                Hücum Komandasına Qoşul
              </Button>
            </CardContent>
          </Card>

          {/* Blue Team */}
          <Card ref={blueCardRef} className="arena-blue border-2 group hover:border-blue-400 transition-all">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-500/20 rounded-full">
                  <Shield className="h-12 w-12 text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-blue-400">Müdafiə Komandası</CardTitle>
              <CardDescription>
                Aşkarlama, cavab və qorunmaya fokuslanmış müdafiə komandası
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-300">Sənin Vəzifən:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Təhlükəsizlik loglarını izləyin və təhlil edin</li>
                  <li>• Təhdidləri aşkarlayın və cavab verin</li>
                  <li>• Təhlükəsizlik nəzarətlərini tətbiq edin</li>
                  <li>• İnsidentlərin araşdırılması və forensik təhlil</li>
                </ul>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Hazırkı Müdafiəçilər:</span>
                <Badge className="bg-blue-500 text-white">8 Aktiv</Badge>
              </div>
              <Button 
                className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                onClick={() => joinTeam('blue')}
              >
                <Eye className="mr-2 h-4 w-4" />
                Müdafiə Komandasına Qoşul
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Battle Interface
        <div ref={battleStatusRef} className="space-y-8">
          {/* Battle Status */}
          <Card className="bg-gradient-to-r from-red-500/10 to-blue-500/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  Mübarizə davam edir
                </CardTitle>
                <Badge variant="outline" className="text-primary">
                  <Clock className="mr-1 h-3 w-3" />
                  Qalan vaxt: 15:30
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">Hücum Komandası</div>
                  <div ref={redScoreRef} className="text-3xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Xallar</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">Xal</div>
                  <Progress value={60} className="mb-2" />
                  <div className="text-sm text-muted-foreground">Hücum Komandası irəlidədir</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">Müdafiə Komandası</div>
                  <div ref={blueScoreRef} className="text-3xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Xallar</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {activeTeam === 'red' ? (
            // Red Team Interface
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="arena-red">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-400">
                    <Target className="mr-2 h-5 w-5" />
                    Hücum Tapşırıqları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {redTeamMissions.map((mission) => (
                    <div key={mission.id} className="p-4 bg-red-900/10 rounded-lg border border-red-500/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{mission.name}</h4>
                        <Badge variant={mission.status === 'Completed' ? 'default' : 'secondary'}>
                          {mission.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Çətinlik: {mission.difficulty}</span>
                        <span className="text-sm">{mission.progress}%</span>
                      </div>
                      <Progress value={mission.progress} className="mb-2" />
                      <Button size="sm" variant="outline" className="w-full border border-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors">
                        <Terminal className="mr-2 h-4 w-4" />
                        Hücuma Davam Et
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Komanda Ünsiyyəti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary/50 h-64 rounded-lg p-4 font-mono text-sm">
                    <div className="text-red-400">[HücumKomandası] exploit_master: Login formunda SQL injection tapıldı</div>
                    <div className="text-red-400">[HücumKomandası] hack3r: Super! Mən admin hüquqlarını əldə etmək üçün sınaqlar aparıram</div>
                    <div className="text-red-400">[HücumKomandası] cyber_ninja: Blue Team sistemləri bərpa edir, tələsin!</div>
                    <div className="text-green-400">[Sistem] Tapşırıq "Web Application Breach" 75% tamanlandı</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : activeTeam === 'blue' ? (
            // Blue Team Interface
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="arena-blue">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-400">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Təhlükəsizlik Xəbərdarlıqları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blueTeamAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 bg-blue-900/10 rounded-lg border border-blue-500/20">
                      <div className="flex justify-between items-start mb-2">
                        <Badge 
                          variant={alert.type === 'High' ? 'destructive' : alert.type === 'Medium' ? 'default' : 'secondary'}
                        >
                          {alert.type} Priority
                        </Badge>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm mb-3">{alert.message}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border border-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                          Araşdır
                        </Button>
                        <Button size="sm" variant="outline" className="border border-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                          Blokla
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Müdafiə Paneli</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary/50 h-64 rounded-lg p-4 font-mono text-sm">
                    <div className="text-blue-400">[MüdafiəKomandası] siem_analyst: Qeyri-adi trafik nümunələrini aşkarlayıram</div>
                    <div className="text-blue-400">[MüdafiəKomandası] defender1: Zərərli IP-ləri bloklayıram</div>
                    <div className="text-blue-400">[MüdafiəKomandası] forensics_pro: Məlumatların qanunsuz çıxarılması cəhdi müşahidə edildi</div>
                    <div className="text-orange-400">[Sistem] Bildiriş: SQL injection cəhdi bloklandı</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Leave Battle */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={leaveBattle} 
              className="border-gray-400 hover:bg-gray-500/10 transition-colors"
            >
              Mübarizədən Çıx
            </Button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mt-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div ref={el => quickStatsRef.current[0] = el} className="text-2xl font-bold">47</div>
            <div className="text-sm text-muted-foreground">Aktiv Döyüşlər</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
            <div ref={el => quickStatsRef.current[1] = el} className="text-2xl font-bold">1,234</div>
            <div className="text-sm text-muted-foreground">Qələbələr</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div ref={el => quickStatsRef.current[2] = el} className="text-2xl font-bold">89%</div>
            <div className="text-sm text-muted-foreground">Uğur Faizi</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div ref={el => quickStatsRef.current[3] = el} className="text-2xl font-bold">24/7</div>
            <div className="text-sm text-muted-foreground">Əlçatandır</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Arena;
