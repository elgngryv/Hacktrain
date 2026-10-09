import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield,
  Swords, 
  Flag, 
  Users, 
  Award, 
  Globe, 
  Zap,
  Target,
  Brain,
  Eye
} from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP-ın ScrollTrigger plugin-ini qeydiyyatdan keçirin
gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  // Animasiya üçün referansları yaradın
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Rəqəmlərin state-ini idarə etmək üçün
  const [animatedStats, setAnimatedStats] = useState({
    hackers: 0,
    challenges: 0,
    arenas: 0
  });

  useEffect(() => {
    // Səhifə yüklənəndə bütün ScrollTrigger instansiyalarını silin
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Hero bölməsi üçün animasiya
    gsap.fromTo(heroRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });

    // ✅ Stats üçün animasiya (rəqəmlərin artması)
    const statsSection = statsRef.current;
    if (statsSection) {
      ScrollTrigger.create({
        trigger: statsSection,
        start: "top 80%",
        onEnter: () => {
          gsap.to(animatedStats, {
            hackers: 1000,
            challenges: 500,
            arenas: 50,
            duration: 2,
            ease: "power1.out",
            onUpdate: () => {
              setAnimatedStats({ ...animatedStats });
            },
            overwrite: true
          });
        },
        onLeaveBack: () => {
          setAnimatedStats({ hackers: 0, challenges: 0, arenas: 0 });
        }
      });
    }

    // ✅ Features bölməsi üçün ardıcıl animasiya
    const featuresSection = featuresRef.current;
    if (featuresSection) {
      gsap.fromTo(gsap.utils.toArray('.feature-card'), 
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2, // Hər element arasında 0.2 saniyə fərq
          scrollTrigger: {
            trigger: featuresSection,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }
    
    // ✅ CTA bölməsi üçün animasiya
    const ctaSection = ctaRef.current;
    if (ctaSection) {
        gsap.fromTo(ctaSection, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaSection,
              start: "top 80%", 
              toggleActions: "play reverse play reverse"
            }
          }
        );
      }

  }, []);

  const features = [
    {
      icon: Globe,
      title: 'Yerli Dil Dəstəyi',
      description: 'Kibertəhlükəsizliyi Azərbaycan dilində öyrənin.',
      color: 'text-primary'
    },
    {
      icon: Swords,
      title: 'Hücum vs Müdafiə Arenası',
      description: 'Red Team hücum edir, Blue Team real vaxtda müdafiə edir – rəqabətli döyüş meydanı.',
      color: 'text-red-400'
    },
    {
      icon: Flag,
      title: 'CTF Tapşırıqları',
      description: 'Kripto, reverse engineering, web istismar və forensics tapşırıqlarını həll edin.',
      color: 'text-accent',
      link: '/challenges'
    },
    {
      icon: Eye,
      title: 'Real Müdafiə Laboratoriyaları',
      description: 'SIEM, IDS/IPS, log analizi və insident cavab ssenariləri ilə praktika edin.',
      color: 'text-blue-400'
    },
    {
      icon: Users,
      title: 'Mentorlar və Tələbələr',
      description: 'Mentorlarla öyrənin və aktiv kibertəhlükəsizlik icmasına qoşulun.',
      color: 'text-purple-400'
    },
    {
      icon: Award,
      title: 'Gamification Sistemi',
      description: 'Medallar qazanın, liderlikdə ön sıralara yüksəlin və bacarıqlarınızı sübut edin.',
      color: 'text-yellow-400'
    }
  ];

  const stats = [
    { key: 'hackers', label: 'Aktiv Hackerlər', suffix: '+' },
    { key: 'challenges', label: 'Tapşırıqlar', suffix: '+' },
    { key: 'arenas', label: 'Döyüş Arenaları', suffix: '+' },
    { key: 'static', label: 'Dəstək', suffix: '' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/70" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative pulse-glow rounded-full p-4 bg-primary/10">
                <Shield className="h-16 w-16 text-primary" />
                <Zap className="h-6 w-6 text-accent absolute -top-1 -right-1" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="cyber-glow-text">HackTrain</span>
              <br />
              <span className="text-foreground">Kibertəhlükəsizlik Tədrisi</span>
              <br />
              <span className="text-muted-foreground text-2xl md:text-4xl">Öyrən və bacarıqlarını sübut et</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Hacking, müdafiə və kibertəhlükəsizlik bacarıqlarını öyrənmək üçün yerli platforma. Gələcəkdə peşəkarlarla birlikdə olun.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="cyber-button-hero">
                <Link to="/auth">
                  <Target className="mr-2 h-5 w-5" />
                  Təlimə başla
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold cyber-glow-text mb-2">
                  {stat.key === 'static' ? '24/7' : Math.floor(animatedStats[stat.key])}
                  {stat.suffix}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="cyber-glow-text">Platforma İmkanları</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hər kəs üçün Kibertəhlükəsizlik: başlanğıcdan peşəkaradək
            </p>
          </div>

          <div className="cyber-grid">
            {features.map((feature, index) => (
              // ✅ `feature-card` class-ı əlavə edin
              <Card key={index} className="cyber-card-glow group feature-card"> 
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="cyber-glow-text">Kiber gücünü</span> kəşf etməyə hazırsan?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Kibertəhlükəsizlik bacarıqlarınızı inkişaf etdirin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="cyber-button-hero">
              <Link to="/auth">
                <Shield className="mr-2 h-5 w-5" />
                Təlimə başla
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/challenges">Tapşırıqlara Bax</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;